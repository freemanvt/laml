/**
 * logger script that returns a logger, if the VVLOGGER environment variable is passed with "winston" value it will use winston logger.
 *
 * Created by vinhta on 29/12/2015.
 */

/**
 * default logger, it only logs to console for warn and error
 *
 * @constructor
 */
function NoLogger() {

}

NoLogger.prototype.debug = function() {};
NoLogger.prototype.info = function() {};
NoLogger.prototype.warn = function() {console.error(arguments);};
NoLogger.prototype.error = function() {console.error(arguments);};

var logger;

if (process.env.VVLOGGER === 'winston') {
    // User selected winston, so we will use winston as the logger
    var winston = require('winston');

    logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                timestamp: true,
                json: false,
                colorize: true
            })
        ]
    });
} else {
    logger = new NoLogger();
}

module.exports = logger;