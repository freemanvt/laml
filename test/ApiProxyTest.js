/**
 * Created by vinhta on 23/01/2016.
 */
var app = require('./../app');
var assert = require('chai').assert;
var request = require('supertest');

var baseUrl = '/v1/httpbin';

/**
 * test suite to test our API Proxy logic
 */
describe('test ApiProxy', function() {

	/**
	 * testing that we can perform a GET request through the Api Proxy
	 */
	describe('test GET request through our proxy', function() {
		it('test GET a json response', function (done) {
			request(app) // pass in app server to request
				.get(baseUrl + '/get')
				.expect(200)
				.expect(/\"url\": \"https:\/\/httpbin.org\/get\"/, done);
		});

		it('test GET request with query parameter', function (done) {
			request(app) // pass in app server to request
				.get(baseUrl + '/get?qname=vinh')
				.expect(200)
				.expect(/"qname": "vinh"/, done);
		});

	});

	/**
	 * testing that we can perform a POST request through the Api Proxy
	 */
	describe('test POST request through our proxy', function() {
		it('test POST an application/x-www-form-urlencoded form', function (done) {
			request(app) // pass in app server to request
				.post(baseUrl + '/post')
				.field('name', 'vinh')
				.expect(200)
				.expect('Content-Type', /json/)
				.expect(/"name": "vinh"/, done);
		});

	});
});