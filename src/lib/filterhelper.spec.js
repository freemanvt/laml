const filterhelper = require('./filterhelper');

describe('filterHelper', () => {
  let flowState, req, res, body, reqContext;

  beforeEach(() => {
    req = {};
    res = {};
    body = {}
    reqContext = {};
    flowState = {
      nextStatus: false,
      reset: jest.fn()
    }
  });

  test('should call reset when flowState.nextStatus is set to true', async () => {

    const filters = [
      {
        filterConfig: {},
        filter: {
          filter: async () => {
            flowState.nextStatus = true;
            Promise.resolve();
          },
        }
      }
    ];

    await filterhelper.runFilters(filters, req, res, body, reqContext, flowState);
    expect(flowState.reset.mock.calls).toHaveLength(1);
  });

  test('should not call reset when flowState.nextStatus is set to false', async () => {

    const filters = [
      {
        filterConfig: {},
        filter: {
          filter: async () => {
            flowState.nextStatus = false;
            Promise.resolve();
          },
        }
      }
    ];

    await filterhelper.runFilters(filters, req, res, body, reqContext, flowState);
    expect(flowState.reset.mock.calls).toHaveLength(0);
  });
});
