/**
 * Singleton class to load and execute an array of filters.
 *
 * Filters are in the <ROOT>/filters directory.
 * You can create your own filters.
 * Filters have to have a function called filter which takes the following arguments
 * -req
 * -res
 * -body
 * -reqContext
 *
 * Created by vinhta on 22/01/2016.
 */
var logger = require('./logger');

var filter = exports = module.exports = {};

var _FILTERS_DIR = 'filters';

/**
 * load the filters
 *
 * @param toLoad
 * @param loadTo
 */
filter.loadFilters = function(toLoad, loadTo) {
	if (toLoad) {
		toLoad.forEach(value => {
			var filter = require('./../' + _FILTERS_DIR + '/' + value);
			loadTo.push(filter);
		});
	}
};

/**
 * Run the array of filters
 *
 * @param filters
 *      array of filters to run
 * @param req
 *      request object
 * @param res
 *      response object
 * @param body
 *      body of the request or response, TODO: currently this will be passed as a raw buffer
 * @param reqContext
 *      request Context that holds information for the current request
 */
filter.runFilters = function(filters, req, res, body, reqContext) {
	logger.debug('runing filters');
	filters.forEach(filter => {
		// each filter must provide a filter function that
		filter.filter(req, res, body, reqContext);
	});
};