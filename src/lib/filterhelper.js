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
const logger = require('./../lib/logger');
const filter = exports = module.exports = {};

const _FILTERS_DIR = 'filters';

/**
 * load the filters
 *
 * @param toLoad
 * @param loadTo
 */
filter.loadFilters = function(toLoad, loadTo) {
	if (toLoad) {
		toLoad.forEach(value => {
			const reqfilter = require('./../' + _FILTERS_DIR + '/' + value.name);
			loadTo.push({
				filter: reqfilter,
				filterConfig: value
			});
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
 * @param flowState
 * 			flowState object that manages the flow
 */
filter.runFilters = async function(filters, req, res, body, reqContext, flowState) {
	for (const filter of filters) {
		await filter.filter.filter(req, res, body, reqContext, filter.filterConfig, flowState.next, flowState.end); // lol
		// TODO deal with early exit, for instance if we get a cache hit, we should ignore the rest of the filters
		if (!flowState.nextStatus) {
			break; // stop running rest of filters
		} else {
			flowState.reset(); // reset for the next filter
		}
	}
};