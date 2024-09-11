const ResponseCache = require('./ResponseCache');
const redisHelper = require('./../lib/redishelper');

// TODO: running jest withredis leaves an opne handle as redis doesn't quite, need to add logic to quit redis after test has completed
jest.mock('./../lib/redishelper');

describe('ResponseCache filter', () => {
  let next, req, res, body, reqContext, filterConfig, end;

  beforeEach(() => {
    next = jest.fn();
    end = jest.fn();
    req = {};
    res = {
      status: () => res,
      end: jest.fn()
    };
    body = {};
    reqContext = {};
    filterConfig = {};
  });

  test('should call end when there is a hit from redis', async () => {
    req = {
      path: 'TEST_PATH',
    };

    redisHelper.get.mockResolvedValue('A HIT');
    await ResponseCache.filter(req, res, body, reqContext, filterConfig, next, end)
    expect(end.mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  })

  test('should call next when there is no hit from redis', async () => {
    req = {
      path: 'TEST_PATH',
    };

    redisHelper.get.mockResolvedValue(null);
    await ResponseCache.filter(req, res, body, reqContext, filterConfig, next, end)
    expect(end.mock.calls).toHaveLength(0);
    expect(next.mock.calls).toHaveLength(1);
  })
});