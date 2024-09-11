const logger = require('./../lib/logger');
const redisHelper = require('./../lib/redishelper');

const filter = async (req, res, body, reqContext, filterConfig, next, end) => {
  logger.debug('invoking ResponseCache');
	logger.debug('config', filterConfig && JSON.stringify(filterConfig))
	logger.debug('req.path', req.path);
  const result = await redisHelper.get(req.path); // TODO: use proper namespace key? for individual organisation
  logger.debug('result', result);
  if (result) {
    // TODO: if there is a hit, pipe it to the response
    logger.debug('found a hit', result);
    res.status(200).end(result); // TODO: set proper response header, decide which header to set based on original response
    end();
  } else {
    logger.debug('calling next');
    next();
  }
}

module.exports = {
  filter
}