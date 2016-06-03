'use strict';

var Parent = require('../lib/hof-standalone');
var api = require('../api');
var helpers = require('../lib/helpers');
var moment = require('moment');
var fields = require('../fields');
var util = require('util');
var _ = require('underscore');

var validators = Parent.validators;
validators = _.extend(validators, {
  'british-date': function britishDate(value) {
    return value === '' || this.regex(value, /^\d{1,2}\/\d{1,2}\/\d{1,4}$/) && moment(value, 'DD/MM/YYYY').isValid();
  }.bind(validators)
});

var SearchController = function SearchController() {
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

var form = new SearchController({
  fields: require('../fields'),
  template: 'pages/search'
});

module.exports = form.requestHandler();
