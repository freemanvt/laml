/**
 * Created by vinhta on 21/01/2016.
 */
var logger = require('./../logger');

var self = exports = module.exports = {};

/**
 * filter the request and call next
 *
 * @param req
 * @param res
 * @param next
 */
self.filter = function (req, res, next) {
	logger.debug('invoking ExampleUserFilter');
}