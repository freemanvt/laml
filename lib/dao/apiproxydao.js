/**
 * Created by vinhta on 23/01/2016.
 */
var logger = require('./../../logger');

var dao = exports = module.exports = {};

/**
 * hard coding the test proxy configuration, ideally this should be read from the file system or a database.
 *
 * @type {*[]}
 */
var apiProxies = [
	// target server https://httpbin.org/get
	{
		name : 'httpbin-demo',
		basePath : '/v1/httpbin',
		requestFilters : ['ApiKeyValidationFilter','AddQueryParameter'],
		responseFilters : ['ExampleResponseFilter.js'],
		userFlows : [ // user can have more than one flow per proxy, the idea is the flow will run based on the matchPath condition
						{
							name : 'example user defined flow',
							matchPath : '/get',
							requestFilters : ['ExampleUserFilter.js'],
							responseFilters : ['ExampleUserFilter.js']
						}
					],
		targetServer : 'https://httpbin.org'
	},
	// target server example http://weather.yahooapis.com/forecastrss?p=94089
	{
		name : 'yahoo weather',
		basePath : '/v1/yahooweather',
		requestFilters : ['ApiKeyValidationFilter','AddQueryParameter'],
		responseFilters : ['ExampleResponseFilter.js'],
		userFlows : [],
		targetServer : 'http://weather.yahooapis.com/forecastrss'
	},
];

dao.getApiProxies = function() {
	return apiProxies;
};
