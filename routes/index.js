'use strict';

const controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/marriage', controllers.marriageSearch)
    .get('/marriage/details/:sysnum?', controllers.marriageDetails)
    .get('/death', controllers.deathSearch)
    .get('/death/details/:sysnum?', controllers.deathDetails)
    .get('/birth', controllers.birthSearch)
    .get('/birth/details/:sysnum?', controllers.birthDetails)
    .get('/details/:sysnum?', controllers.birthDetails)
    .use('/audit/user-activity', controllers.audit)
    .use(/^\/$/, controllers.birthSearch);
};
