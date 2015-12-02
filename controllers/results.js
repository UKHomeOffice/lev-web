'use strict';

var Model = require('../models');
var _ = require('underscore');
var helpers = require('../lib/helpers');

module.exports = function renderResults(req, res) {
  var model = new Model(req.session.model);
  var records = model.get('records');
  var query = model.get('query');

  res.render('pages/results', {
    count: records && records.length,
    records: records,
    query: query,
    querystring: helpers.serialize(query)
  });
};
