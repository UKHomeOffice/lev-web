'use strict';

var url = require('url');


var Apivevents = require('./ApiveventsService');


module.exports.getEvents = function getEvents (req, res, next) {
  Apivevents.getEvents(req.swagger.params, res, next);
};

module.exports.getEvent = function getEvent (req, res, next) {
  Apivevents.getEvent(req.swagger.params, res, next);
};
