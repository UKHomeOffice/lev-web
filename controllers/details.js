'use strict';

var api = require('../api');
var helpers = require('../lib/helpers');

module.exports = function renderDetails(req, res) {
  if (req.params && req.params.sysnum) {
    const username = req.headers['X-Auth-Username'] || req.headers['x-auth-username'];
    const canRedirectToResults = (req.query && req.query.multipleResults) !== undefined;
    api.requestID(req.params.sysnum, username)
      .then(function resolved(result) {
        res.render('pages/details', {record: result, querystring: helpers.serialize(req.query),
          canRedirectToResults: canRedirectToResults});
      }, function rejected(err) {
        res.render('pages/error', err);
      });
  } else {
    res.redirect('/');
  }

};
