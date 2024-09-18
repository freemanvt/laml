/**
 * dao to manage all CRUD operation for retrieving our API proxy configuration
 *
 * Created by vinhta on 23/01/2016.
 */
const { PrismaClient } = require('@prisma/client');
const logger = require('../logger');

const prisma = new PrismaClient();

const REQUEST_FILTER = 1;
const RESPONSE_FILTER = 2;
const USER_FLOW_REQUEST_FILTER = 3;
const USER_FLOW_RESPONSE_FILTER = 4;

const addFilters = (filters, filterType) => {
  return filters
      .filter((toFilter) => toFilter.api_proxy_filter_type_id === filterType) // filter by FilterType
      .map((filter) => {
        let mappedFilter = {
          id: filter.api_proxy_filters_id,
          name: filter.api_filters?.name
        }
        if (filter.config_json) {
          const configJson = JSON.parse(filter.config_json);
          mappedFilter = {
            ...mappedFilter,
            ...configJson
          }
        }
        return mappedFilter;
      });
};

const mapDbToObj = apiProxy => {
  let proxy = {
    id: apiProxy.api_proxy_id,
    uuid: apiProxy.uuid,
    name: apiProxy.name,
    basePath: apiProxy.basepath,
    targetServer: apiProxy.target_server,
    description: apiProxy.description,
    requestFilters: addFilters(apiProxy.api_proxy_filters, REQUEST_FILTER),
    responseFilters: addFilters(apiProxy.api_proxy_filters, RESPONSE_FILTER),
    lastUpdated: apiProxy.last_updated,
    createdAt: apiProxy.created_at
  }; 
  // add user flow
  const userFlows = apiProxy.api_user_flows.map(userFlow => {
    const flow = {
      id: userFlow.api_user_flow_id,
      name: userFlow.name,
      matchPath: userFlow.match_path,
      requestFilters: addFilters(userFlow.api_proxy_filters, USER_FLOW_REQUEST_FILTER),
      responseFilters: addFilters(userFlow.api_proxy_filters, USER_FLOW_RESPONSE_FILTER)
    } ;
    return flow;
  });
  proxy.userFlows = userFlows;
  return proxy;
}

const getProxyById = async (apiProxyId) => {
  const proxy = await prisma.api_proxies.findUnique({
    where: {
      api_proxy_id: apiProxyId
    },
    include: {
      api_proxy_filters: {
        include: {
          api_filters: true
        }
      },
      api_user_flows: {
        include: {
          api_proxy_filters: {
            include: {
              api_filters: true
            }
          }
        }
      }
    },
  });
  return mapDbToObj(proxy);
}

const getAllProxies = async () => {
	const allProxies = await prisma.api_proxies.findMany({
    include: {
      api_proxy_filters: {
        include: {
          api_filters: true
        }
      },
      api_user_flows: {
        include: {
          api_proxy_filters: {
            include: {
              api_filters: true
            }
          }
        }
      }
    },
  });

  // map into an api proxy object
  const apiProxies = allProxies.map(mapDbToObj);
	logger.debug(`apiProxies ${JSON.stringify(apiProxies, null, 2)}`);
	return apiProxies;
};

const saveApiProxy = async (apiProxy) => {
  let data = {
    name: apiProxy.name,
    basepath: apiProxy.basePath,
    target_server: apiProxy.targetServer,
    description: apiProxy.description
  }
  const proxy = await prisma.api_proxies.create({ data })
  return proxy;
};

/**
 * a filters to a apiProxyId
 * 
 * request: 
 * {
 *  apiProxyId: number, // the api proxy id
 *  filterId: number, // the api filter type such as ResponseCache
 *  filterTypeId: number, // which type of filter is this [REQUEST, RESPONSE, USER_FLOW_REQUEST, USER_FLOW_RESPONSE],
 *  userFlowId: number, // if this is a user flow request/response filter link to user flow record for this api proxy
 *  position: number, // the position in the flow
 *  configJson: object, // json representation of the configuratioon for this filter
 * }
 */
const saveApiProxyFilter = async (filter) => {
  const data = {
    api_proxy_id: filter.apiProxyId,
    api_user_flow_id: filter.userFlowId,
    api_filter_id: filter.filterId,
    api_proxy_filter_type_id: filter.filterTypeId,
    position: filter.position,
    config_json: JSON.stringify(filter.configJson)
  }
  const newfilter = await prisma.api_proxy_filters.create({ data });
  return newfilter;
}

/**
 * create a user flow for an API proxy, an api proxy can have multiple user flows for different path of the target server
 * 
 * request:
 * {
 *  apiProxyId: number, // the api proxy id
 *  name: string, // name of the user flow
 *  matchPath: string, // the path the userflow is mapped to for the target server
 *                      // so for instance target_server https://httpbin.org
 *                      // and the match_path is /get, then the url for this userflow will be https://httpbin.org/get
 * }
 * 
 * @param {*} userFlow 
 */
const saveUserFlow = async (userFlow) => {
  let data = {
    api_proxy_id: userFlow.apiProxyId,
    name: userFlow.name,
    match_path: userFlow.matchPath
  }
  const newUserFlow = await prisma.api_user_flows.create({ data });
  return newUserFlow;
}

module.exports = {
  getApiProxies: async () => {
    if (process.env.NO_DB === 'true') { // no db options for less setup for local testing of invoking an api proxy endpoint
      return require('./mock-apiproxyconfigs');
    }
    return await getAllProxies();
  },
  getProxyById,
  saveApiProxy,
  saveApiProxyFilter,
  saveUserFlow
}