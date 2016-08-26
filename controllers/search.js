'use strict';

const Parent = require('../lib/hof-standalone');
const api = require('../api');
const helpers = require('../lib/helpers');
const moment = require('moment');
require('moment-round');
const fields = require('../fields');
const util = require('util');
const _ = require('lodash');

var validators = Parent.validators;

const britishDate = function britishDate(value) {
  return value === ''
    || (this.regex(value, /^\d{1,2}\/\d{1,2}\/(?:\d\d){1,2}$/) && moment(value, 'DD/MM/YYYY').isValid())
    || (this.regex(value, /^(?:\d\d){3,4}$/) && moment(value, 'DDMMYYYY').isValid());
}.bind(validators);
const past = value =>
  value === '' ||
    moment(value, /^\d{6,8}$/.test(value) ? 'DDMMYYYY' : 'DD/MM/YYYY').isBefore(moment().ceil(24, 'hours'));
const since = (value, epoc) =>
  value === '' ||
    moment(value, /^\d{6,8}$/.test(value) ? 'DDMMYYYY' : 'DD/MM/YYYY').isSameOrAfter(moment(epoc).floor(24, 'hours'));

validators = _.extend(validators, {
  'british-date': britishDate,
  'past': past,
  'since': since
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
      const error = (err instanceof(Error))
        ? err
        : new Error(err);

      callback(error, req, res, callback);
    }
  };

  api.read(req.form.values, username)
    .then(resolved, rejected);
  this.emit('complete', req, res);
};

const form = new SearchController({
  fields: require('../fields'),
  template: 'pages/search'
});

module.exports = form.requestHandler();
