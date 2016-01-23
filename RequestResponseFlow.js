/**
 * Define a request or response flow, holds a list of filters that will get executed one of the other.
 *
 *
 * req -> default req flow (always get executed) ApiProxy.requestFilters
 *      --> 1 or more user defined req/response flows, matched by the path
 *          --> invoke endpoint and get response
 *              --> matched user define req/response flow
 *                  -> default res flow. ApiProxy.responseFilters
 *                      --> client
 *
 * Created by vinhta on 22/01/2016.
 */
'use strict';

var logger = require('./logger');
var request = require('request');
var _ = require('lodash');
var filterhelper = require('./lib/filterhelper');

function RequestResponseFlow() {
	this.config = {
		name : 'example user defined flow',
		matchPath : '/get',
		requestFilters : ['ExampleUserFilter.js'],
		responseFilters : ['ExampleUserFilter.js']
	};


	this.requestFilters = []; // will be executed left to right
	this.responseFilters = [];


	// load all the request filters
	filterhelper.loadFilters(this.config.requestFilters, this.requestFilters);

	// load all the response filters
	filterhelper.loadFilters(this.config.responseFilters, this.responseFilters);
}

module.exports = RequestResponseFlow;