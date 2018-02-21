'use strict';

var controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/marriage', controllers.marriageSearch)
    .get('/marriage/details/:sysnum?', controllers.marriageDetails)
    .get('/death', controllers.deathSearch)
    .get('/death/details/:sysnum?', controllers.deathDetails)
    .get('/details/:sysnum?', controllers.details)
    .use('/audit/user-activity', controllers.audit)
    .use(/^\/$/, controllers.search);
};
