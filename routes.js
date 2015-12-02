'use strict';

var controllers = require('./controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/', controllers.search.show)
    .post('/', controllers.search.query)
    .get('/results', controllers.results)
    .get('/details/:sysnum?', controllers.details);
};
