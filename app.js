'use strict';

var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');

if (config.env === 'development') {
  app.use('/public', express.static(path.resolve(__dirname, './public')));
}

app.use(function setAssetPath(req, res, next) {
  res.locals.assetPath = '/public';
  next();
});

app.use(function setBaseUrl(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './views'));
require('hmpo-govuk-template').setup(app);
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));

require('./routes')(app);

app.listen(config.port, config.listen_host);
/*eslint no-console: 0*/
console.log('App listening on port', config.port);
