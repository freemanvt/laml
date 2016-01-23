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
var filterhelper = require('./lib/filterhelper');


function ApiProxy() {
    this.config = {
        name : 'httpbin-demo',
        basePath : '/v1/httpbin',
	    requestFilters : ['ApiKeyValidationFilter','AddQueryParameter'],
	    responseFilters : ['ExampleResponseFilter.js'],
	    userFlows : {},
        targetServer : 'https://httpbin.org'
    };


    this.requestFilters = []; // will be executed left to right
    this.responseFilters = [];


	// load all the request filters
	filterhelper.loadFilters(this.config.requestFilters, this.requestFilters);

	// load all the response filters
	filterhelper.loadFilters(this.config.responseFilters, this.responseFilters);

	// load the user flows
	var userFlow = new RequestResponseFlow();
	this.config.userFlows[userFlow.config.matchPath] = userFlow;

}


/**
 * invoke the request against the target server
 *
 * @param req
 * @param res
 * @param next
 */
ApiProxy.prototype.invoke = function(req, res, next) {
	filterhelper.runFilters(this.requestFilters, req, res, next);
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
			return userFlowToRun = this.config.userFlows[key];
		}
	});

	// run the user request flow
	if (userFlowToRun) {
		filterhelper.runFilters(userFlowToRun.requestFilters, req, res, next);
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
	var bodyContent = req.body;
	if (req.method === 'POST') {
		options.body = bodyContent;
	}

	// get query if available
	options.qs = '';

	request(options, (error, response, body) => {
		logger.debug('response body', body);
		// iterate through target server response header and set it in the response back to the client
		// this also allow us to perform custom set headers if we need to
		_.each(_.keys(response.headers), key => {
			res.set(key, response.headers[key]);

		});

		// run the user request flow filters
		if (userFlowToRun) {
			filterhelper.runFilters(userFlowToRun.responseFilters, req, res, next);
		}

		// run default response filters
		filterhelper.runFilters(this.responseFilters, req, res, next);
		res.send(body);
	});
};

module.exports = ApiProxy;