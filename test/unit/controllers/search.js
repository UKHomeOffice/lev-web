'use strict';

var proxyquire = require('proxyquire');
var reqres = require('reqres');
var _ = require('lodash');
var moment = require('moment');

var formSubmission = function formSubmission(extension) {
  return _.extend({
    'system-number': '',
    'surname': '',
    'forenames': '',
    'dob': ''
  }, extension);
};

describe('controllers/search', function () {
  var api = {
    read: sinon.stub()
  };
  var hof = require('../../../lib/hof-standalone');
  var searchController = proxyquire('../../../controllers/search', {
    '../api': api
  });

  it('is a function', function () {
    searchController.should.be.a('function');
  });

  describe('validator', () => {
    describe('british-date', () => {
      it('should exist as a function', () => {
        hof.validators.should.have.property('british-date').that.is.a('function');
      });

      it('should accept properly formatted dates', () => {
        hof.validators['british-date']('31/12/1999').should.be.ok;
        hof.validators['british-date']('3/1/1999').should.be.ok;
        hof.validators['british-date']('3/1/99').should.be.ok; // really!?
        hof.validators['british-date']('1/1/1').should.be.ok; // really!? really!?
      });

      it('should accept short format dates', () => {
        hof.validators['british-date']('31121999').should.be.ok;
        hof.validators['british-date']('03011999').should.be.ok;
      });

      it('should not accept improperly formatted dates', () => {
        hof.validators['british-date']('11/22/1999').should.not.be.ok;
        hof.validators['british-date']('3-1-99').should.not.be.ok;
      });

      it('should not accept short format dates without leading zeros', () => {
        hof.validators['british-date']('3111999').should.not.be.ok;
        hof.validators['british-date']('311999').should.not.be.ok;
      });
    });

    describe('past', () => {
      it('should exist as a function', () => {
        hof.validators.should.have.property('past').that.is.a('function');
      });

      it('should accept dates in the past', () => {
        hof.validators.past('1/1/1970').should.be.ok;
        hof.validators.past('01011970').should.be.ok;
      });

      it('should accept today\'s date', () => {
        hof.validators.past(moment().format('DD/MM/YYYY')).should.be.ok;
        hof.validators.past(moment().format('DDMMYYYY')).should.be.ok;
      });

      it('should not accept dates in the future', () => {
        hof.validators.past(moment().add(1, 'day').format('DD/MM/YYYY')).should.not.be.ok;
        hof.validators.past(moment().add(1, 'day').format('DDMMYYYY')).should.not.be.ok;
      });
    });

    describe('since', () => {
      it('should exist as a function', () => {
        hof.validators.should.have.property('since').that.is.a('function');
      });

      it('should accept dates after a specified date', () => {
        hof.validators.since(moment().add(1, 'year').format('DD/MM/YYYY'), moment()).should.be.ok;
        hof.validators.since(moment().add(1, 'year').format('DDMMYYYY'), moment()).should.be.ok;
      });
      
      it('should accept the day of the specified date', () => {
        const date = moment().add(-1, 'year');
        hof.validators.since(date.format('DD/MM/YYYY'), date).should.be.ok;
        hof.validators.since(date.format('DDMMYYYY'), date).should.be.ok;
      });
      
      it('should not accept dates before the specified date', () => {
        hof.validators.since(moment().add(-1, 'day').format('DD/MM/YYYY'), moment()).should.not.be.ok;
        hof.validators.since(moment().add(-1, 'day').format('DDMMYYYY'), moment()).should.not.be.ok;
      });
    });
  });

  describe('middleware', function () {
    var res;

    beforeEach(function () {
      res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };
    });

    describe('when there is no query string', function () {
      var req;

      beforeEach(function () {
        req = reqres.req();
      });

      it('renders the search page', function () {
        searchController(req, res);

        res.render.should.have.been.calledWith('pages/search');
      });
    });

    describe('when there is a query string', function () {
      var req;

      beforeEach(function () {
        req = _.extend(reqres.req(), {
          body: undefined,
          headers: {
            'X-Auth-Username': 'mrs-caseworker'
          },
          method: 'GET'
        });
      });

      describe('resolved promise', function() {
        it('redirects to the details page on one record returned', function() {
          var sysnum = 123456789;
          var query = formSubmission({
            'system-number': `${sysnum}`
          });

          req.query = query;
          api.read.withArgs(query).returns(Promise.resolve([{
            'system-number': sysnum
          }]));

          searchController(req, res);

          return Promise.resolve().then(function () {
            res.redirect.should.have.been.calledWith(`/details/${sysnum}?system-number=${sysnum}`);
          });
        });

        it('renders the results page', function() {
          var query = formSubmission({
            'surname': 'smiths',
            'forenames': 'john',
            'dob': '01/01/2011'
          });
          var records = [{
            surname: 'smith'
          }, {
            surname: 'smith'
          }];

          req.query = query;
          api.read.withArgs(query).returns(Promise.resolve(records))

          searchController(req, res);

          return Promise.resolve().then(function () {
            res.render.should.have.been.calledWith('pages/results', {
              count: 2,
              records: records,
              query: query,
              querystring: 'surname=smiths&forenames=john&dob=01%2F01%2F2011'
            });
          });
        });

      });

      describe('rejected promise', function() {
        it('renders the error page', function() {
          var query = formSubmission({
            'surname': 'unfoundsurname',
            'forenames': 'unfoundforenames',
            'dob': '01/01/2011'
          });

          req.query = query;
          api.read.withArgs(query).returns(Promise.reject({
            name: 'NotFoundError'
          }));

          searchController(req, res);

          return Promise.resolve().then(function () {
            res.render.should.have.been.calledWith('pages/results', {
              count: 0,
              records: null,
              query: query,
              querystring: 'surname=unfoundsurname&forenames=unfoundforenames&dob=01%2F01%2F2011'
            });
          });
        });
      });
    });
  });
});
