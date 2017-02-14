'use strict';

const Parent = require('../lib/hof-standalone');
const api = require('../api');
const helpers = require('../lib/helpers');
const validators = require('../lib/custom-validators');
const fields = require('../fields');
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
  const username = req.headers['X-Auth-Username'] || req.headers['x-auth-username'];
  const query = _.pick(req.query, _.keys(fields));
  const querystring = helpers.serialize(query);

  const resolved = (records) => {
    if (records.length === 1) {
      res.redirect('/details/' + records[0]['system-number'] + '?' + querystring);
    } else {
      res.render('pages/results', {
        count: records && records.length,
        records: records,
        query: query,
        querystring: querystring
      });
    }
  };

  const rejected = (err) => {
    if (err.name === 'NotFoundError') {
      res.render('pages/results', {
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

  api.findBirths(req.form.values, username)
    .then(resolved, rejected);
  this.emit('complete', req, res);
};

const form = new SearchController({
  fields: fields,
  template: 'pages/search'
});

module.exports = form.requestHandler();
