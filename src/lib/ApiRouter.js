/**
 * ApiRouter manages all the API Proxies
 * - loads up and store at runtime all the api proxies
 * - return the correct proxy
 * Created by vinhta on 20/01/2016.
 */
var ApiProxy = require('./ApiProxy');
var logger = require('./logger');

class ApiRouter {
	constructor(apiProxiesConfig) {
		this.apiProxies = {};
		// loop through all the api proxies and create an APIProxy object
		apiProxiesConfig.forEach(apiProxyConfig => {
			var apiProxy = new ApiProxy(apiProxyConfig);
			this.apiProxies[apiProxy.config.basePath] = apiProxy;
			logger.info(`loaded api proxy [${apiProxy.config.name}], ${apiProxy.config.description}`);	
		});
	}

	/**
 * get the api proxy that matches the base path
 *
 * @param basePath
 * @returns {*}
 */
	getApiProxy(basePath) {
		// if the key matches the beginning of the basePath TODO: this will not work for all use cases
		// TODO: update logic to use regex
		return Object.values(this.apiProxies).find(apiProxy => {
			const result = basePath.indexOf(apiProxy.getConfig().basePath) === 0;
			logger.debug(`basePath ${basePath} apiProxy.basePath ${apiProxy.getConfig().basePath} result ${result}`);
			return result;
		});
	}
}

module.exports = ApiRouter;