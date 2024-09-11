/**
 * ApiProxy is a wrapper round the target API
 *
 * Created by vinhta on 20/01/2016.
 */
const request = require('request');
const logger = require('./logger');
const ApiError = require('./ApiError');
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

		apiProxyConfig.userFlows.forEach(userFlowConfig => {
			logger.debug('userFlow', JSON.stringify(userFlowConfig, null, 2))
			const userFlow = new RequestResponseFlow(userFlowConfig);
			this.config.userFlows[userFlow.config.matchPath] = userFlow;
		});
		logger.debug('loaded user flow', JSON.stringify(this.config.userFlows, null, 2));
	}

	getConfig = () => this.config;

	getUserFlowToRunByPath = (path) => {
		const correctKey = Object.keys(this.config.userFlows).find(key => path.indexOf(key) === 0);
		if (correctKey) {
			return this.config.userFlows[correctKey];
		}
		return  null;
	}

	/**
	 * invoke the request against the target server
	 *
	 * @param req
	 * @param res
	 * @param next
	 * @param reqContext
	 */
	async invoke(req, res, next, reqContext) {
		logger.debug('running request filters');
		const flowState = {
			nextStatus: false,
			endStatus: false,
			next: () => flowState.nextStatus = true,
			reset: () => flowState.nextStatus = false,
			end: () => flowState.endStatus = true,
		};

		await filterhelper.runFilters(this.requestFilters, req, res, req.body, reqContext, flowState);
		if (flowState.endStatus) { //check if we should end this request here
			// don't continue
			// TODO: there might be times when we want to continue, need to think about
			//check if a response has been sent by the filter
			if (!res.headersSent) {
				throw new ApiError(500, 'OOPS SOMETHING WENT WRONG VV, RESPONSE HASN\'T BEEN SENT BY THE FILTER THAT ENDED THE REQUEST'); // TODO: clean up error responses
			}
			return;
		}

		logger.debug('calling target server', this.config.targetServer);
		logger.debug('method', req.method);
		logger.debug('header', req.headers);
		logger.debug('req.path', req.path);

		// separate the basepath from the rest of the path
		const restOfPath = req.path.replace(this.config.basePath, '');
		logger.debug('restOfPath', restOfPath);

		// check if there's a user flow that matches the restOfPath
		const userFlowToRun = this.getUserFlowToRunByPath(restOfPath);
		logger.debug('userFlows', userFlowToRun)

		// run the user request flow
		if (userFlowToRun) {
			logger.debug('running user request filters');
			await filterhelper.runFilters(userFlowToRun.requestFilters, req, res, req.body, reqContext, flowState);
			if (flowState.endStatus) { //check if we should end this request here
				// don't continue
				// TODO: there might be times when we want to continue, need to think about
				//check if a response has been sent by the filter
				if (!res.headersSent) {
					throw new ApiError(500, 'OOPS SOMETHING WENT WRONG VV, RESPONSE HASN\'T BEEN SENT BY THE USER FILTER THAT ENDED THE REQUEST'); // TODO: clean up error responses
				}
				return;
			}
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

		console.log('hereer2e')


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

		request(options, async (error, response, body) => {
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
				await filterhelper.runFilters(userFlowToRun.responseFilters, req, res, body, reqContext, flowState);
			}

			// run default response filters
			logger.debug('running default response filters');
			filterhelper.runFilters(this.responseFilters, req, res, body, reqContext, flowState);
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