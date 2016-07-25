'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var config = require('./config');
var logger = require('./lib/logger');
var churchill = require('churchill');
var hof = require('hof');
var template = hof.template;
var i18n = hof.i18n;
var mixins = hof.mixins;
var fields = require('./fields');

process.title = 'levweb';

if (config.env !== 'acceptance') {
  churchill.options.logGetParams = false;
  app.use(churchill(logger));
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

app.use(require('./middleware/error')());

server.listen(config.port, config.listen_host);
logger.info('App listening on port', config.port);


// gracefuly handle shutdowns -----------------------

const closeGracefully = (signal) => {
  setTimeout(() => {
    console.warn('Forcefully shutting down from sig:', signal);
    process.exit(0);
  }, 500);

  server.close(() => process.exit(0));
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
  process.on(signal, () => closeGracefully(signal))
);
