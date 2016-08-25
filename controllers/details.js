'use strict';

const api = require('../api');
const helpers = require('../lib/helpers');
const fields = require('../fields');
const _ = require('lodash');

module.exports = function renderDetails(req, res, next) {
  if (req.params && req.params.sysnum) {
    const username = req.headers['X-Auth-Username'] || req.headers['x-auth-username'];
    const canRedirectToResults = (req.query && req.query.multipleResults) !== undefined;

    api.requestID(req.params.sysnum, username)
      .then(function resolved(result) {
        res.render('pages/details', { record: result, querystring: helpers.serialize(_.pick(req.query, _.keys(fields))),
          canRedirectToResults: canRedirectToResults });
      }, function rejected(err) {
        if (err.name === 'NotFoundError') {
          next();
        } else {
          const error = err instanceof(Error)
            ? err
            : new Error(err);

          next(error, req, res, next);
        }
      });
  } else {
    res.redirect('/');
  }
};
