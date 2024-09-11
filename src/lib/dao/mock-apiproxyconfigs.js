/**
 * hard coding the test proxy configuration
 *
 * @type {*[]}
 */
var apiProxies = [
	// target server https://httpbin.org/get
	{
		name : 'httpbin-demo', // name of the api proxy
		basePath : '/v1/httpbin', // the base path that will be exposed to the client
		requestFilters : [
			{
				name: 'ApiKeyValidationFilter',
				apiKeyName: 'apikey'
			},
			{
				name: 'AddQueryParameter',
				params: [
					{
						key: 'username',
						value: 'John'
					},
					{
						key: 'surname',
						value: 'Doe'
					}
				]
			},
			{
				name: 'ResponseCache'
			},
		], // filters to run during the default request flow
		responseFilters : [
			{
				name: 'ResponseCacheResponse'
			},
			{
				name: 'ExampleResponseFilter'
			}
		], // filter to run during the default response flow
		userFlows : [ // user can have more than one flow per proxy, the idea is the flow will run based on the matchPath condition
						{
							name : 'example user defined flow', // name of the user flow
							matchPath : '/get', // path to match for this user flow, so given a url path of /v1/httpbin/get, this is the /get part"
							requestFilters : [
								{
									name: 'ExampleUserFilter'
								}
							], // filters to run during the user request flow
							responseFilters : [
								{
									name: 'ExampleUserFilter'
								}
							] // filters to run during the user response flow
						}
					],
		targetServer : 'https://httpbin.org', // this is the target endpoint you are wrapping
		description: 'httpbin test endpoint, resend request to http://localhost:8000/v1/httpbin/get'
	},
	// target server example http://weather.yahooapis.com/forecastrss?p=94089
	// {
	// 	name : 'yahoo weather',
	// 	basePath : '/v1/yahooweather',
	// 	requestFilters : ['ApiKeyValidationFilter','AddQueryParameter'],
	// 	responseFilters : ['ExampleResponseFilter.js'],
	// 	userFlows : [],
	// 	targetServer : 'http://weather.yahooapis.com/forecastrss'
	// },
];

module.exports = apiProxies;