'use strict';

var controllers = require('./controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/', controllers.login.show)
    .post('/', controllers.login.create)
    .get('/search', controllers.search.show)
    .post('/search', controllers.search.query)
    .get('/results', controllers.results)
    .get('/details/:sysnum?', controllers.details);
};
