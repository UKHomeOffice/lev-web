'use strict';

var express = require('express');
var app = express();
var path = require('path');
var config = require('./config');

process.title = 'levweb';

// FIXME: Remove ' || true' once nginx is in place
if (config.env === 'development' || config.env === 'acceptance' || true) {
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

require('./routes')(app);

app.use(require('./middleware/error')());

app.listen(config.port, config.listen_host);
/*eslint no-console: 0*/
console.log('App listening on port', config.port);
