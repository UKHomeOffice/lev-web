'use strict';

var _ = require('underscore');
var Model = require('../models');

module.exports = function renderDetails(req, res) {
  var model = new Model(req.session.model);
  var records = model.get('records');
  var record = records[0];
  var locals;

  if (req.params && req.params.sysnum) {
    record = _.findWhere(model.toJSON().records, {
      'system-number': req.params.sysnum
    });
  }

  if (record) {
    locals = {record: record};
  } else {
    locals = {message: 'No records available'};
  }

  res.render('pages/details', locals);
};
