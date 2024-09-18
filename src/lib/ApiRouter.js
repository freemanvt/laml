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
		// TODO: this should be changed to always retrieving the latest copy from the RDBMS. 
		// TODO: Would need to refactor to use apiproxydao to getAllProxies and also fetch one proxy
		// TODO: Would need to change logic in getApiProxy(basePath) so it performs a DB operation to match the basePath
		this.apiProxies = {}; 
		this.load(apiProxiesConfig);
	}

	load(apiProxiesConfig) {
		// loop through all the api proxies and create an APIProxy object
		apiProxiesConfig.forEach(apiProxyConfig => {
			var apiProxy = new ApiProxy(apiProxyConfig);
			this.apiProxies[apiProxy.config.basePath] = apiProxy;
			logger.info(`loaded api proxy [${apiProxy.config.name}], ${apiProxy.config.description}`);	
		});
	}

	/**
	 * crude implementation for adding new api proxy when they are created manually
	 * TODO: implement proper solution
	 * @param {*} apiProxiesConfig 
	 */
	reload(apiProxiesConfig) {
		logger.debug('reloading api proxies')
		logger.debug(apiProxiesConfig)
		this.apiProxies = {}; 
		this.load(apiProxiesConfig);
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
		// TODO: for real production usage this should be performinf this find against the RDBMS
		return Object.values(this.apiProxies).find(apiProxy => {
			const result = basePath.indexOf(apiProxy.getConfig().basePath) === 0;
			logger.debug(`basePath ${basePath} apiProxy.basePath ${apiProxy.getConfig().basePath} result ${result}`);
			return result;
		});
	}
}

module.exports = ApiRouter;