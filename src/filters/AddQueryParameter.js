/**
 * Example filter
 *
 * Created by vinhta on 21/01/2016.
 */
const logger = require('./../lib/logger');

const self = exports = module.exports = {};

/**
 * filter the request and call next
 *
 * @param req
 * @param res
 * @param body
 * @param reqContext
 * @param filterConfig
 * @param 
 */
self.filter = function (req, res, body, reqContext, filterConfig, next) {
	logger.debug('invoking AddQueryParameter');
	logger.debug('config', filterConfig && JSON.stringify(filterConfig))
	logger.debug('req.path', req.path);
	const queryParamsToAdd = filterConfig.params;
	queryParamsToAdd.forEach(param => {
		req.query[param.key] = param.value;
	});
	next();
};