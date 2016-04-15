'use strict';

var api = require('../api');

module.exports = function renderDetails(req, res) {
  if (req.params && req.params.sysnum) {
    api.requestID(req.params.sysnum)
      .then(function resolved(result) {
        res.render('pages/details', {record: result});
      }, function rejected(err) {
        res.render('pages/error', err);
      });
  } else {
    res.redirect('/');
  }

};
