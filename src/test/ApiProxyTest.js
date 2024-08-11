/**
 * Created by vinhta on 23/01/2016.
 */
var app = require('./../app');
var assert = require('chai').assert;
var request = require('supertest');



/**
 * test suite to test our API Proxy logic
 *
 * Api proxy added for testing;
 *
 * // target server https://httpbin.org/get
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
 */

var proxy1BaseUrl = '/v1/httpbin';
var proxy2BaseUrl = '/v1/yahooweather';

describe('test ApiProxy', function() {

	/**
	 * testing that we can perform a GET request through the Api Proxy
	 */
	describe('test GET request through our proxy', function() {
		it('test GET a json response', function (done) {
			request(app) // pass in app server to request
				.get(proxy1BaseUrl + '/get')
				.expect(200)
				.expect(/\"url\": \"https:\/\/httpbin.org\/get\"/, done);
		});

		it('test GET request with query parameter', function (done) {
			request(app) // pass in app server to request
				.get(proxy1BaseUrl + '/get?qname=vinh')
				.expect(200)
				.expect(/"qname": "vinh"/, done);
		});

		it('test GET request with query parameter for proxy 2, yahoo weather for Beverly hill', function (done) {
			request(app) // pass in app server to request
				.get(proxy2BaseUrl + '?p=90210')
				.expect(200)
				.expect(/<title>Yahoo! Weather - Beverly Hills, CA<\/title>/, done);
		});

	});

	/**
	 * testing that we can perform a POST request through the Api Proxy
	 */
	describe('test POST request through our proxy', function() {
		it('test POST an application/x-www-form-urlencoded form', function (done) {
			request(app) // pass in app server to request
				.post(proxy1BaseUrl + '/post')
				.field('name', 'vinh')
				.expect(200)
				.expect('Content-Type', /json/)
				.expect(/"name": "vinh"/, done);
		});

	});
});