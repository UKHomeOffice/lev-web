'use strict';

var controllers = require('./controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/', controllers.query.show)
    .post('/', controllers.query.get)
    .get('/list', controllers.list)
    .get('/details', controllers.details);
};
