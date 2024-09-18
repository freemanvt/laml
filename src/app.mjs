/**
 * Main express app
 *
 * Created by vinhta on 13/01/2016.
 */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import ApiRouter from './lib/ApiRouter.js';
import logger from './lib/logger.js';
import proxyDao from './lib/dao/apiproxydao.js';
import redisClient from './lib/redishelper.js';
import ApiError from './lib/ApiError.js';
import admin from './routes/admin.js';

const app = express();

const apiProxies = await proxyDao.getApiProxies();
const apiRouter = new ApiRouter(apiProxies);

app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.raw({ // we want the full body as raw byte
	type : '*/*'
}));

// Security filter
const authenticateHeader = function (req, res, next) {
    next();
};

const addApiRouter = function(req, res, next) {
	req.local = {
		apiRouter
	}
	next();
}

// admin endpoints
app.use('/admin/apiproxy', addApiRouter, admin);

// api proxy endpoint
app.use(async (req, res, next) => {
	// get the path
	logger.debug('basePath', req.path);
	if (req.path === '/favicon.ico') {
		return res.end();
	} else {
		try {
			const apiProxy = apiRouter.getApiProxy(req.path);
			if (apiProxy) {
				const reqContext = {};
				await apiProxy.invoke(req, res, next, reqContext);
			} else {
				return res.status(404).send('No such URL [' + req.path + ']');
			}
		} catch(e) {
			logger.error('a', e);
			next(e);
		}
	}
});

// default error handler, must be the last 
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
		res.status(err.httpStatusCode).json(err.toJson());
	} else {
		res.status(500).json({ error: 'An error occurred'});
	}
})

export default app;

