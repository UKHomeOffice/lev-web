'use strict';

const Parent = require('../lib/hof-standalone');
const api = require('../api');
const helpers = require('../lib/helpers');
const validators = require('../lib/custom-validators');
const fields = require('../fields/partnership');
const reqInfo = require('../lib/req-info');
const util = require('util');
const _ = require('lodash');

validators.addValidators(Parent.validators);

const SearchController = function SearchController() {
  Parent.apply(this, arguments);
};

util.inherits(SearchController, Parent);

// Only redirect when a single result is returned, otherwise render
// results page
SearchController.prototype.successHandler = function successHandler(req, res, callback) {
  const query = _.pick(req.query, _.keys(fields));
  const querystring = helpers.serialize(query);
  const ri = reqInfo(req);

  const resolved = (records) => {
    if (records.length === 1) {
      res.redirect('/partnership/details/' + records[0].id + '?' + querystring);
    } else {
      res.render('pages/partnership-results', {
        count: records && records.length,
        records: records,
        query: query,
        querystring: querystring
      });
    }
  };

  const rejected = (err) => {
    if (err.name === 'NotFoundError') {
      res.render('pages/partnership-results', {
        count: 0,
        records: null,
        query: query,
        querystring: querystring
      });
    } else {
      const error = (err instanceof Error)
        ? err
        : new Error(err);

      callback(error, req, res, callback);
    }
  };

  api.findPartnerships(req.form.values, ri)
    .then(resolved, rejected);
  this.emit('complete', req, res);
};

const form = new SearchController({
  fields: fields,
  template: 'pages/partnership-search'
});

module.exports = form.requestHandler();
