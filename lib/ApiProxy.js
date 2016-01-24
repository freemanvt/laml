/**
 * ApiProxy is a wrapper round the target API
 *
 * Created by vinhta on 20/01/2016.
 */

'use strict';

var logger = require('./logger');
var request = require('request');
var RequestResponseFlow = require('./RequestResponseFlow');
var _ = require('lodash');
var filterhelper = require('./filterhelper');
var zlib = require('zlib');

/**
 * Constructor
 *
 * @param apiProxyConfig
 *      Configuration information for this API proxy
 * @constructor
 */
function ApiProxy(apiProxyConfig) {
    this.config = {
        name : apiProxyConfig.name,
        basePath : apiProxyConfig.basePath,
	    requestFilters : apiProxyConfig.requestFilters,
	    responseFilters : apiProxyConfig.responseFilters,
	    userFlows : {},
        targetServer : apiProxyConfig.targetServer
    };


    this.requestFilters = []; // will be executed left to right
    this.responseFilters = [];


	// load all the request filters
	filterhelper.loadFilters(this.config.requestFilters, this.requestFilters);

	// load all the response filters
	filterhelper.loadFilters(this.config.responseFilters, this.responseFilters);

	// load the user flows
	_.each(apiProxyConfig.userFlows, userFlowConfig => {
		var userFlow = new RequestResponseFlow(userFlowConfig);
		this.config.userFlows[userFlow.config.matchPath] = userFlow;
	});


}


/**
 * invoke the request against the target server
 *
 * @param req
 * @param res
 * @param next
 * @param reqContext
 */
ApiProxy.prototype.invoke = function(req, res, next, reqContext) {

	filterhelper.runFilters(this.requestFilters, req, res, req.body, reqContext);
	logger.debug('calling target server', this.config.targetServer);
	logger.debug('method', req.method);
	logger.debug('header', req.headers);
	logger.debug('req.path', req.path);

	// separate the basepath from the rest of the path
	var restOfPath = req.path.replace(this.config.basePath, '');
	logger.debug('restOfPath', restOfPath);

	// check if there's a user flow that matches the restOfPath
	var userFlowToRun = null;
	_.each(_.keys(this.config.userFlows), key => {
		if (restOfPath.indexOf(key) === 0) {// if the key matches the beginning of the basePath TODO: this will not work for all use cases
			userFlowToRun = this.config.userFlows[key];
			return false;
		}
	});

	// run the user request flow
	if (userFlowToRun) {
		filterhelper.runFilters(userFlowToRun.requestFilters, req, res, req.body, reqContext);
	}

	// create options for request
	var options = {};
	options.method = req.method;
	options.uri = this.config.targetServer + restOfPath;
	options.headers = {
	};
	// iterate through request header and set it in the request back to the target server
	// this also allow us to perform custom set headers if we need to
	_.each(_.keys(req.headers), key => {
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
			return res.setStatus(500).end();
		}

		logger.debug('response body', body);


		// iterate through target server response header and set it in the response back to the client
		// this also allow us to perform custom set headers if we need to
		_.each(_.keys(response.headers), key => {
			res.set(key, response.headers[key]);

		});

		// run the user request flow filters
		if (userFlowToRun) {
			filterhelper.runFilters(userFlowToRun.responseFilters, req, res, body, reqContext);
		}

		// run default response filters
		filterhelper.runFilters(this.responseFilters, req, res, body, reqContext);
		// if content type is gzip, we should send back a gzip
		var encoding = response.headers['content-encoding'];
		if (encoding == 'gzip') {
			var buf = new Buffer(body, 'utf-8');   // Choose encoding for the string.
			zlib.gzip(buf, function (_, result) {  // The callback will give you the
				res.end(result);                     // result, so just send it.
			});
		} else {
			res.send(body);
		}


	});
};

module.exports = ApiProxy;