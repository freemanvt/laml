const AddQueryParameter = require('./AddQueryParameter');
const { filter } = require('./ApiKeyValidationFilter');

describe('AddQueryParameter filter', () => {
  let next, req, res, body, reqContext, filterConfig;

  beforeEach(() => {
    next = jest.fn();
    req = {
      query: {}
    };
    res = {};
    body = {};
    reqContext = {};
    filterConfig = {};
  });

  test('should add correct parameter from filterConfig and call next', () => {
    req = {
      ...req,
      path: 'TEST_PATH',
    };

    filterConfig = {
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
    }

    AddQueryParameter.filter(req, res, body, reqContext, filterConfig, next);
    expect(req.query.username).toEqual('John');
    expect(req.query.surname).toEqual('Doe');
    expect(next.mock.calls).toHaveLength(1);
  });
});