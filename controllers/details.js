'use strict';

const api = require('../api');
const helpers = require('../lib/helpers');
const fields = require('../fields');
const _ = require('lodash');

module.exports = function renderDetails(req, res, next) {
  req.params = req.params || {};

  const systemNumber = req.params.sysnum;

  if (systemNumber === undefined) {
    next(new ReferenceError('The parameter \'id\' was not defined'), req, res);
  } else if (!systemNumber.match(/^[0-9]+$/)) {
    next(new TypeError('The parameter \'id\' was not an integer'), req, res);
  } else {
    const username = req.headers['X-Auth-Username'] || req.headers['x-auth-username'];
    const canRedirectToResults = (req.query && req.query.multipleResults) !== undefined;

    const promise = api.requestID(Number(systemNumber), username);

    promise
      .then((result) => {
          res.render('pages/details', {
              record: result,
              querystring: helpers.serialize(_.pick(req.query, _.keys(fields))),
              canRedirectToResults: canRedirectToResults
            });
        }, (err) => {
          if (err.name === 'NotFoundError') {
            next();
          } else {
            const error = err instanceof(Error)
              ? err
              : new Error(err);

            next(error, req, res, next);
          }
        });
  }
};
