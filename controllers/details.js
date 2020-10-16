'use strict';

const api = require('../api');
const helpers = require('../lib/helpers');
const fields = require('../fields');
const reqInfo = require('../lib/req-info');
const _ = require('lodash');

const handleError = (err, next) => {
  if (err.name === 'NotFoundError') {
    return next();
  }

  return next(err instanceof Error ? err : new Error(err));
};

module.exports = function renderDetails(req, res, next) {
  req.params = req.params || {};
  const systemNumber = req.params.sysnum;
  const ri = reqInfo(req);

  if (systemNumber === undefined) {
    return next(new ReferenceError('The parameter \'id\' was not defined'), req, res);
  }
  if (!systemNumber.match(/^[0-9]+$/)) {
    return next(new TypeError('The parameter \'id\' was not an integer'), req, res);
  }

  const canRedirectToResults = (req.query && req.query.multipleResults) !== undefined;

  return api.findBySystemNumber(Number(systemNumber), ri)
    .then(result => res.render('pages/details', {
          record: result,
          querystring: helpers.serialize(_.pick(req.query, _.keys(fields))),
          canRedirectToResults: canRedirectToResults
        }),
        err => handleError(err, next)
    );
};
