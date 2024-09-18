/**
 * admin api proxy endpoint
 * 
 */
const express = require('express');
const router = express.Router();

const logger = require('../lib/logger');
const { getProxyById, getApiProxies, saveApiProxy, saveApiProxyFilter, saveUserFlow } = require('../lib/dao/apiproxydao');


router.get('/', async (req, res) => {
  try {
    const proxies = await getAllProxies();
    res.json(proxies);
  } catch (e) {
    throw e;
  } 
});

router.get('/:apiProxyId', async (req, res) => {
  try {
    const apiProxyId = req.params.apiProxyId;
    logger.debug(`apiProxyId ${apiProxyId}`);
    const proxy = await getProxyById(parseInt(apiProxyId));
    res.json(proxy);
  } catch (e) {
    throw e;
  } 
});

router.post('/', async (req, res) => {
  try {
    logger.debug(req.body);
    const output = await saveApiProxy(req.body);
    res.json(output);
    req.local.apiRouter.reload(await getApiProxies()); // TODO: refactor for better solution to reload api proxy information in our aip router
  } catch (e) {
    throw e;
  } 
});

/**
 * a filters to a apiProxyId
 * 
 * request: 
 * {
 *  filterId: number, // the api filter type such as ResponseCache
 *  filterTypeId: number, // which type of filter is this [REQUEST, RESPONSE, USER_FLOW_REQUEST, USER_FLOW_RESPONSE],
 *  userFlowId: number, // if this is a user flow request/response filter link to user flow record for this api proxy
 *  position: number, // the position in the flow
 *  configJson: object, // json representation of the configuratioon for this filter
 * }
 */
router.post('/:apiProxyId/filters', async (req, res) => {
  try {
    logger.debug(req.body);
    const filter = {
      ...req.body,
      apiProxyId: parseInt(req.params.apiProxyId)
    }
    const output = await saveApiProxyFilter(filter);
    res.json(output);
    req.local.apiRouter.reload(await getApiProxies());
  } catch (e) {
    throw e;
  } 
});

/**
 * post request for add a userflow to an API proxy
 * 
 * request:
 * {
 *  name: string, // name of the user flow
 *  matchPath: string, // the path the userflow is mapped to for the target server
 *                      // so for instance target_server https://httpbin.org
 *                      // and the match_path is /get, then the url for this userflow will be https://httpbin.org/get
 *  }
 */
router.post('/:apiProxyId/userflows', async (req, res) => {
  try {
    logger.debug(req.body);
    const userFlow = {
      ...req.body,
      apiProxyId: parseInt(req.params.apiProxyId)
    }
    const output = await saveUserFlow(userFlow);
    res.json(output);
    req.local.apiRouter.reload(await getApiProxies()); 
  } catch (e) {
    throw e;
  } 
})

module.exports = router;

