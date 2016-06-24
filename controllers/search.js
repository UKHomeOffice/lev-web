'use strict';

const Parent = require('../lib/hof-standalone');
const api = require('../api');
const helpers = require('../lib/helpers');
const moment = require('moment');
const fields = require('../fields');
const util = require('util');
const _ = require('lodash');

var validators = Parent.validators;
validators = _.extend(validators, {
  'british-date': function britishDate(value) {
    return value === '' || this.regex(value, /^\d{1,2}\/\d{1,2}\/\d{1,4}$/) && moment(value, 'DD/MM/YYYY').isValid();
  }.bind(validators)
});

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

  api.read(req.form.values, username)
    .then(function resolved(records) {

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
    }, function rejected(err) {
      if (err.name === 'NotFoundError') {
        res.render('pages/results', {
          count: 0,
          records: null,
          query: query,
          querystring: querystring
        });
      }

      callback((err instanceof(Error)) ? err : new Error(err), req, res, callback);
    });
  this.emit('complete', req, res);
};

const form = new SearchController({
  fields: require('../fields'),
  template: 'pages/search'
});

module.exports = form.requestHandler();
