'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var config = require('./config');
var hmpoLogger = require('hmpo-logger');
var hof = require('hof');
var template = hof.template;
var i18n = hof.i18n;
var mixins = hof.mixins;
var fields = require('./fields');

process.title = 'levweb';

hmpoLogger.config({
    console: true,
    consoleJSON: config.env === 'production',
    consoleLevel: config.env === 'production' ? 'info' : 'debug',
    consoleColor: true,
    app: false,
    error: false,
    meta: {
        host: 'host',
        pm: 'env.pm_id',
        sessionID: 'sessionID',
        method: 'method',
        request: 'request'
    },
    requestMeta: {
        clientip: 'clientip',
        uniqueID: 'req.x-uniq-id',
        remoteAddress: 'connection.remoteAddress',
        hostname: 'hostname',
        port: 'port',
        response: 'statusCode',
        responseTime: 'responseTime',
        httpversion: 'version',
        bytes: 'res.content-length'
    },
    logPublicRequests: true,
    logHealthcheckRequests: true,
    format: ':clientip :sessionID :method :request HTTP/:httpVersion '
          + ':statusCode :res[content-length] - :responseTime ms'
});

var logger = hmpoLogger.get();

if (config.env !== 'acceptance') {
  app.use(hmpoLogger.middleware());
}

app.use('/public', express.static(path.resolve(__dirname, './public')));

app.use(function setAssetPath(req, res, next) {
  res.locals.assetPath = '/public';
  next();
});

app.use(function setBaseUrl(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  res.locals.absBaseUrl = req.baseUrl || '/';
  next();
});

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './views'));
template.setup(app);
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(i18n.middleware());
app.use(mixins(fields));

require('./routes')(app);

app.use(require('./middleware/not-found')());
app.use(require('./middleware/error')());

server.listen(config.port, config.listen_host);
logger.info('App listening on port', config.port);

// gracefully handle shutdowns -----------------------

const closeGracefully = (signal) => {
  setTimeout(() => {
    logger.warn('Forcefully shutting down from sig:', signal);
    process.exit(0); // eslint-disable-line no-process-exit
  }, 500);

  server.close(() => process.exit(0)); // eslint-disable-line no-process-exit
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
  process.on(signal, () => closeGracefully(signal))
);
