'use strict';

var _ = require('underscore');
var api = require('../api');

module.exports = function renderDetails(req, res, next) {
  if (req.params && req.params.sysnum) {
    api.read({
      'system-number': req.params.sysnum
    }).then(function resolved(result) {
        res.render('pages/details', {record: result.records[0]});
      }, function rejected(err) {
        res.render('pages/error', err);
      });
  } else {
    res.redirect('/');
  }

};
