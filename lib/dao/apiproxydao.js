/**
 * dao to manage all CRUD operation for retrieving our API proxy configuration
 *
 * Created by vinhta on 23/01/2016.
 */
var logger = require('./../logger');

var dao = exports = module.exports = {};

/**
 * hard coding the test proxy configuration, ideally this should be read from the file system or a database.
 *
 * @type {*[]}
 */
var apiProxies = [
	// target server https://httpbin.org/get
	{
		name : 'httpbin-demo', // name of the api proxy
		basePath : '/v1/httpbin', // the base path that will be exposed to the client
		requestFilters : ['ApiKeyValidationFilter','AddQueryParameter'], // filters to run during the default request flow
		responseFilters : ['ExampleResponseFilter.js'], // filter to run during the default response flow
		userFlows : [ // user can have more than one flow per proxy, the idea is the flow will run based on the matchPath condition
						{
							name : 'example user defined flow', // name of the user flow
							matchPath : '/get', // path to match for this user flow, so given a url path of /v1/httpbin/get, this is the /get part"
							requestFilters : ['ExampleUserFilter.js'], // filters to run during the user request flow
							responseFilters : ['ExampleUserFilter.js'] // filters to run during the user response flow
						}
					],
		targetServer : 'https://httpbin.org' // this is the target endpoint you are wrapping
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

/**
 * Get all the api proxies configuration
 *
 * @returns {*[]}
 */
dao.getApiProxies = function() {
	return apiProxies;
};
