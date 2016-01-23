/**
 * Created by vinhta on 20/01/2016.
 */
'use strict';

var ApiProxy = require('./ApiProxy');
var logger = require('./logger');
var _ = require('lodash');

function ApiRouter () {
	this.apiProxies = {};
	var apiProxy = new ApiProxy();
	this.apiProxies[apiProxy.config.basePath] = apiProxy;
}

/**
 * get the api proxy that matches the base path
 * @param basePath
 * @returns {*}
 */
ApiRouter.prototype.getApiProxy = function (basePath) {
	// we need to perform regex to see if there is any match
	var apiProxy = null;
	_.each(_.keys(this.apiProxies), key => {
		if (basePath.indexOf(key) === 0) {// if the key matches the beginning of the basePath TODO: this will not work for all use cases
			return apiProxy = this.apiProxies[key];
		}
	});
	return apiProxy;
};

module.exports = new ApiRouter();