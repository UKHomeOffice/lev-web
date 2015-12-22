'use strict';

var _ = require('underscore');
var Model = require('../models');
var helpers = require('../lib/helpers');

module.exports = function renderDetails(req, res) {
  var model = new Model(req.session.model);
  var record = {record: model.get('records')[0]};

  if (req.params && req.params.sysnum) {
    record.record = _.findWhere(model.toJSON().records, {
      'system-number': parseInt(req.params.sysnum, 10)
    });
  }

  res.render('pages/details', _.extend({
    querystring: helpers.serialize(model.get('query'))
  }, record));
};
