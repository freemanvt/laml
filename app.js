/**
 * Created by vinhta on 13/01/2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var ApiRouter = require('./ApiRouter');
var logger = require('./logger');
var proxyDao = require('./lib/dao/apiproxydao');

// run configuration
var apiRouter = new ApiRouter(proxyDao.getApiProxies());

app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.raw({ // we want the full body as raw byte
	type : '*/*'
}));

// Security filter
var authenticateHeader = function (req, res, next) {
    next();
};

app.use( (req, res, next) => {
	// get the path
	logger.debug('basePath', req.path);
	if (req.path === '/favicon.ico') {
		return res.end();
	} else {
		var apiProxy = apiRouter.getApiProxy(req.path);
		if (apiProxy) {
			apiProxy.invoke(req, res, next);
		} else {
			return res.status(404).send('No such URL [' + req.path + ']');
		}
	}
});

// TODO: add exception middleware function

module.exports = app;

