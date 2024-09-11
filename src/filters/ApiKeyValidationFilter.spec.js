const ApiKeyValidationFilter = require('./ApiKeyValidationFilter');
const ApiError = require('../lib/ApiError');

describe('ApiKeyValidationFilter filter', () => {
  let next, req, res, body, reqContext, filterConfig;

  beforeEach(() => {
    next = jest.fn();
    req = {};
    res = {};
    body = {};
    reqContext = {};
    filterConfig = {};
  });

  test('should call next when apikey is valid', () => {
    req = {
      path: 'TEST_PATH',
      query: {
        apikey: '12345QWERTY'
      }
    };

    ApiKeyValidationFilter.filter(req, res, body, reqContext, filterConfig, next);
    expect(next.mock.calls).toHaveLength(1);
  });

  test('should throw error when apikey is valid', () => {
    req = {
      path: 'TEST_PATH',
      query: {
        apikey: 'INVALID_KEY'
      }
    };

    const throwError = () => ApiKeyValidationFilter.filter(req, res, body, reqContext, filterConfig, next);
    expect(throwError).toThrow(ApiError);
    expect(throwError).toThrow('INVALID KEY');
  });
});
