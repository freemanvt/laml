/**
 * ApiProxy is a wrapper round the target API
 *
 * Created by vinhta on 20/01/2016.
 */
const logger = require('./logger');
const request = require('request');
const RequestResponseFlow = require('./RequestResponseFlow');
const filterhelper = require('./filterhelper');
const zlib = require('zlib');

class ApiProxy {
	constructor(apiProxyConfig) {
		this.config = {
			...apiProxyConfig,
			userFlows : {}
		};

		this.requestFilters = []; // will be executed left to right
		this.responseFilters = [];

		// load all the request filters
		filterhelper.loadFilters(this.config.requestFilters, this.requestFilters);

		// load all the response filters
		filterhelper.loadFilters(this.config.responseFilters, this.responseFilters);

		// load the user flows
		apiProxyConfig.userFlows.forEach(userFlowConfig => {
			const userFlow = new RequestResponseFlow(userFlowConfig);
			this.config.userFlows[userFlow.config.matchPath] = userFlow;
		});
	}

	getConfig = () => this.config;

	/**
	 * invoke the request against the target server
	 *
	 * @param req
	 * @param res
	 * @param next
	 * @param reqContext
	 */
	invoke(req, res, next, reqContext) {
		logger.debug('running request filters');
		filterhelper.runFilters(this.requestFilters, req, res, req.body, reqContext);
		logger.debug('calling target server', this.config.targetServer);
		logger.debug('method', req.method);
		logger.debug('header', req.headers);
		logger.debug('req.path', req.path);

		// separate the basepath from the rest of the path
		const restOfPath = req.path.replace(this.config.basePath, '');
		logger.debug('restOfPath', restOfPath);

		// check if there's a user flow that matches the restOfPath
		const userFlowToRun = Object.values(this.config.userFlows).find(key => restOfPath.indexOf(key) === 0);

		// run the user request flow
		if (userFlowToRun) {
			logger.debug('running user request filters');
			filterhelper.runFilters(userFlowToRun.requestFilters, req, res, req.body, reqContext);
		}

		// create options for request
		var options = {};
		options.method = req.method;
		options.uri = this.config.targetServer + restOfPath;
		options.headers = {};

		// iterate through request header and set it in the request back to the target server
		// this also allow us to perform custom set headers if we need to
		Object.keys(req.headers).forEach(key => {
			if (key != 'host')
				options.headers[key] = req.headers[key];
		});

		logger.debug('option.headers', options.headers);

		if (req.method === 'POST') {
			options.body = req.body;
		}

		// get query if available
		if (req.query) {
			options.qs = req.query;
		}

		// handle compressed response, by default request doesn't, see https://github.com/request/request#requestoptions-callback
		options.gzip = true;

		request(options, (error, response, body) => {
			if (error)  {
				logger.error(error);
				return res.status(500).end();
			}

			logger.debug('response body', body);


			// iterate through target server response header and set it in the response back to the client
			// this also allow us to perform custom set headers if we need to
			Object.keys(response.headers).forEach(key => {
				res.set(key, response.headers[key]);
			})
			
			// run the user response flow filters
			if (userFlowToRun) {
				logger.debug('running user response filters');
				filterhelper.runFilters(userFlowToRun.responseFilters, req, res, body, reqContext);
			}

			// run default response filters
			logger.debug('running default response filters');
			filterhelper.runFilters(this.responseFilters, req, res, body, reqContext);
			// if content type is gzip, we should send back a gzip
			var encoding = response.headers['content-encoding'];
			if (encoding == 'gzip') {
				var buf = Buffer.from(body, 'utf-8');   // Choose encoding for the string.
				zlib.gzip(buf, function(_, result) {  // The callback will give you the
					res.end(result);                     // result, so just send it.
				});
			} else {
				res.send(body);
			}
		});
	};
}

module.exports = ApiProxy;