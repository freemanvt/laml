const request = require('request');
const ApiProxy = require('./ApiProxy');
const ApiError = require('./ApiError');
const filterHelper = require('./filterhelper');
const mockApiProxyConfigs = require('./dao/mock-apiproxyconfigs');

var mockRunFilter = jest.fn().mockImplementation((filters, req, res, body, reqContext, flowState) => {
  console.log('inside runFilterMock 1');
  flowState.end();
});

// mock filterHelper.runFilters and replace with custom logic
jest.mock('./filterhelper', () => {
  const originalModule = jest.requireActual('./filterhelper');
  return {
    ...originalModule,
    runFilters: (filters, req, res, body, reqContext, flowState) =>  mockRunFilter(filters, req, res, body, reqContext, flowState)
  }
});

jest.mock('request');

describe('ApiProxy', () => {

  let apiProxy, req, res, next;

  beforeEach(() => {
    apiProxy = new ApiProxy(mockApiProxyConfigs[0]);
    req = {
      body: {},
      path: 'PATH',
      method: 'GET',
      headers: {}
    };
    res = {};
    next = jest.fn();
  });

  test('should create instance of ApiProxy', () => {
    expect(apiProxy instanceof ApiProxy).toBe(true);
  });

  describe('invoke', () => {
    test('should end flow when flow.endStatus is false and not throw error and not call request', async () => {
      res = {
        headersSent: true
      }
      await expect(apiProxy.invoke(req, res,next, {})).resolves.not.toThrowError(ApiError);
      expect(request.mock.calls).toHaveLength(0);
    });

    test('should continue flow when flow.nextStatus is true call request', async () => {
      mockRunFilter = jest.fn().mockImplementation((filters, req, res, body, reqContext, flowState) => {
        console.log('inside runFilterMock 2');
        flowState.next();
      });

      await expect(apiProxy.invoke(req, res,next, {})).resolves.not.toThrowError();
      expect(request.mock.calls).toHaveLength(1);
    });
  });
});