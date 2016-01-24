/**
 * Run the app
 *
 * Created by vinhta on 13/01/2016.
 */
var app = require('./app');
var logger = require('./lib/logger');

var _PORT = 8000;

app.listen(process.env.PORT || _PORT, function () {
	logger.info('server started on port ', process.env.PORT || _PORT);
});