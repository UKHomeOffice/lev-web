'use strict';

var controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/', controllers.search.show)
    .get('/results', controllers.results.query)
    .get('/details/:sysnum?', controllers.details);
};
