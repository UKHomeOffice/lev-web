'use strict';

const controllers = require('../controllers');

module.exports = function defineRoutes(app) {
  app
    .get('/marriage', controllers.marriageSearch)
    .get('/marriage/details/:sysnum?', controllers.marriageDetails)
    .get('/partnership', controllers.partnershipSearch)
    .get('/partnership/details/:sysnum?', controllers.partnershipDetails)
    .get('/death', controllers.deathSearch)
    .get('/death/details/:sysnum?', controllers.deathDetails)
    .get('/details/:sysnum?', controllers.details)
    .use('/audit/user-activity', controllers.audit)
    .use(/^\/$/, controllers.search);
};
