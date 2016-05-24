'use strict';

var controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/details/:sysnum?', controllers.details)
    .use('/', controllers.search);
};
