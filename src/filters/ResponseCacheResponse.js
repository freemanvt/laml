const logger = require('./../lib/logger');
const redisHelper = require('./../lib/redishelper');

const filter = async (req, res, body, reqContext, filterConfig, next) => {
  logger.debug('invoking ResponseCacheResponse');
	logger.debug('config', filterConfig && JSON.stringify(filterConfig))
	logger.debug('req.path', req.path);
  redisHelper.set(req.path, body); // cache the response, TODO we would need to have more logic on how to cache properly, // TODO: set proper response header, decide which header to set based on original response
  // TODO: set TTL on redis cache
  next();
}

module.exports = {
  filter
}