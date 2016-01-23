/**
 * Created by vinhta on 22/01/2016.
 */
var logger = require('./../logger');

var filter = exports = module.exports = {};

var _FILTERS_DIR = 'filters';

filter.loadFilters = function(toLoad, loadTo) {
	if (toLoad) {
		toLoad.forEach(value => {
			var filter = require('./../' + _FILTERS_DIR + '/' + value);
			loadTo.push(filter);
		});
	}
}

filter.runFilters = function(filters, req, res, next) {
	logger.debug('runing filters');
	filters.forEach(filter => {
		filter.filter(req, res, next);
	});
}