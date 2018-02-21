'use strict';

var controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/death', controllers.deathSearch)
    .get('/death/details/:sysnum?', controllers.deathDetails)
    .get('/details/:sysnum?', controllers.details)
    .use('/audit/user-activity', controllers.audit)
    .use(/^\/$/, controllers.search);
};
