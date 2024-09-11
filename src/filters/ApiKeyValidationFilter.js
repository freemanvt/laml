/**
 * Example filter
 *
 * Created by vinhta on 21/01/2016.
 */

const ApiError = require('../lib/ApiError');
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
 * @param next
 */
self.filter = function (req, res, body, reqContext, filterConfig, next) {
	logger.debug('invoking ApiKeyValidationFilter');
	logger.debug('config', filterConfig && JSON.stringify(filterConfig))
	logger.debug('req.path', req.path);
	const apiKey = req.query.apikey;
	if (!(apiKey && apiKey === '12345QWERTY')) { // TODO: proper implementation for key validation
		logger.error('INVALID KEY');
		// invalid key, return 401
		throw new ApiError(401, 'INVALID KEY');
	}
	next();
};

