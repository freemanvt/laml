/**
 * Main express app
 *
 * Created by vinhta on 13/01/2016.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const ApiRouter = require('./lib/ApiRouter');
const logger = require('./lib/logger');
const proxyDao = require('./lib/dao/apiproxydao');

// run configuration
const apiRouter = new ApiRouter(proxyDao.getApiProxies());

app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.raw({ // we want the full body as raw byte
	type : '*/*'
}));

// Security filter
const authenticateHeader = function (req, res, next) {
    next();
};

app.use( (req, res, next) => {
	// get the path
	logger.debug('basePath', req.path);
	if (req.path === '/favicon.ico') {
		return res.end();
	} else {
		const apiProxy = apiRouter.getApiProxy(req.path);
		if (apiProxy) {
			const reqContext = {};
			apiProxy.invoke(req, res, next, reqContext);
		} else {
			return res.status(404).send('No such URL [' + req.path + ']');
		}
	}
});

// TODO: add exception middleware function

module.exports = app;

