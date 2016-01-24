/**
 * Example filter
 *
 * Created by vinhta on 21/01/2016.
 */
var logger = require('./../lib/logger');

var self = exports = module.exports = {};

/**
 * filter the request and call next
 *
 * @param req
 * @param res
 * @param body
 * @param reqContext
 */
self.filter = function (req, res, body, reqContext) {
	logger.debug('invoking AddQueryParameter');
	logger.debug('req.path', req.path);
};