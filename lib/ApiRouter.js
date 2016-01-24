/**
 * ApiRouter manages all the API Proxies
 * - loads up and store at runtime all the api proxies
 * - return the correct proxy
 * Created by vinhta on 20/01/2016.
 */
'use strict';

var ApiProxy = require('./ApiProxy');
var logger = require('./logger');
var _ = require('lodash');

/**
 * Constructor
 *
 * @param apiProxies
 * @constructor
 */
function ApiRouter (apiProxies) {
	this.apiProxies = {};
	// loop through all the api proxies and create an APIProxy object
	_.each(apiProxies, apiProxyConfig => {
		var apiProxy = new ApiProxy(apiProxyConfig);
		this.apiProxies[apiProxy.config.basePath] = apiProxy;
		logger.info('loaded api proxy [' + apiProxy.config.name + ']');
	});

}

/**
 * get the api proxy that matches the base path
 *
 * @param basePath
 * @returns {*}
 */
ApiRouter.prototype.getApiProxy = function (basePath) {
	// we need to perform regex to see if there is any match
	var apiProxy = null;
	_.each(_.keys(this.apiProxies), key => {
		if (basePath.indexOf(key) === 0) {// if the key matches the beginning of the basePath TODO: this will not work for all use cases
			apiProxy = this.apiProxies[key];
			return false;
		}
	});
	return apiProxy;
};

module.exports = ApiRouter;