'use strict';

var express = require('express');
var app = express();
var path = require('path');
var config = require('./config');
var logger = require('./lib/logger');
var churchill = require('churchill');

process.title = 'levweb';

if (config.env !== 'acceptance') {
  app.use(churchill(logger));
}

app.use('/public', express.static(path.resolve(__dirname, './public')));

app.use(function setAssetPath(req, res, next) {
  res.locals.assetPath = '/public';
  next();
});

app.use(function setBaseUrl(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

app.use(function setAbsoluteBaseUrl(req, res, next) {
  res.locals.absoluteBaseUrl = 'https://' + req.get('host') + req.baseUrl;
  res.locals.absoluteBaseUrlEscaped = encodeURIComponent(res.locals.absoluteBaseUrl);
  res.locals.keycloakRealm = config.keycloakRealm;
  next();
});

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './views'));
require('hmpo-govuk-template').setup(app);
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

require('./routes')(app);

app.use(require('./middleware/error')());

app.listen(config.port, config.listen_host);
logger.info('App listening on port', config.port);
