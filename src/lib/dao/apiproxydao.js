/**
 * dao to manage all CRUD operation for retrieving our API proxy configuration
 *
 * Created by vinhta on 23/01/2016.
 */
const { PrismaClient } = require('@prisma/client');
const logger = require('../logger');

const dao = exports = module.exports = {};

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
  const apiProxies = allProxies.map(apiProxy => {
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
  });
	logger.debug(`loaded initial apiProxies ${JSON.stringify(apiProxies, null, 2)}`);
	return apiProxies;
};

dao.getApiProxies = async function() {
	if (process.env.NO_DB === 'true') { // no db options for less setup for local testing
		return require('./mock-apiproxyconfigs');
	}
	return await getAllProxies();
}