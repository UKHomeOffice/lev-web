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

describe('controllers/search', function() {
  var api = {
    findBirths: sinon.stub()
  };
  var hof = require('../../../lib/hof-standalone');
  var searchController = proxyquire('../../../controllers/search', {
    '../api': api
  });

  it('is a function', function() {
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
        hof.validators['british-date']('3/1/99').should.be.ok;
      });

      it('should accept short format dates', () => {
        hof.validators['british-date']('31121999').should.be.ok;
        hof.validators['british-date']('03011999').should.be.ok;
      });

      it('should accept really short format dates', () => {
        hof.validators['british-date']('311299').should.be.ok;
        hof.validators['british-date']('030199').should.be.ok;
      });

      it('should not accept improperly formatted dates', () => {
        hof.validators['british-date']('11/22/1999').should.not.be.ok;
        hof.validators['british-date']('3-1-99').should.not.be.ok;
        hof.validators['british-date']('1/1/111').should.not.be.ok;
        hof.validators['british-date']('1/1/1').should.not.be.ok;
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

  describe('middleware', function() {
    var res;

    beforeEach(function() {
      res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };
    });

    describe('when there is no query string', function() {
      var req;

      beforeEach(function() {
        req = reqres.req();
      });

      it('renders the search page', function() {
        searchController(req, res);

        res.render.should.have.been.calledWith('pages/search');
      });
    });

    describe('when there is a query string', function() {
      var req;

      beforeEach(function() {
        req = _.extend(reqres.req(), {
          body: undefined,
          headers: {
            'X-Auth-Username': 'mrs-caseworker'
          },
          method: 'GET'
        });
      });

      describe('resolved promise', function() {
        it('redirects to the details page on one record returned', function(done) {
          var sysnum = 123456789;
          var query = formSubmission({
            'system-number': `${sysnum}`
          });

          req.query = query;
          api.findBirths.withArgs(query).returns(Promise.resolve([{
            'system-number': sysnum
          }]));

          res.redirect = function(url) {
            url.should.equal(`/details/${sysnum}?system-number=${sysnum}`);
            done();
          };

          searchController(req, res);
        });

        it('renders the results page', function(done) {
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
          api.findBirths.withArgs(query).returns(Promise.resolve(records));

          res.render = function(view, locals) {
            view.should.equal('pages/results');
            locals.should.eql({
              count: 2,
              records: records,
              query: query,
              querystring: 'surname=smiths&forenames=john&dob=01%2F01%2F2011'
            });
            done();
          };

          searchController(req, res);
        });

      });

      describe('rejected promise', function() {
        var query;

        beforeEach(function() {
          query = formSubmission({
            'surname': 'unfoundsurname',
            'forenames': 'unfoundforenames',
            'dob': '01/01/2011'
          });

          req.query = query;
        });

        describe('due to not being found', function() {
          beforeEach(function() {
            api.findBirths.withArgs(query).returns(Promise.reject({
              name: 'NotFoundError'
            }));
          });

          it('renders the results page', function(done) {
            res.render = function(view, locals) {
              view.should.equal('pages/results');
              locals.should.eql({
                count: 0,
                records: null,
                query: query,
                querystring: 'surname=unfoundsurname&forenames=unfoundforenames&dob=01%2F01%2F2011'
              });
              done();
            };

            searchController(req, res);
          });
        });

        describe('due to any other error', function() {
          var err;

          beforeEach(function() {
            err = new Error({
              name: 'UnexpectedError'
            });
            api.findBirths.withArgs(query).returns(Promise.reject(err));
          });

          it('passes on to the error handler', function(done) {
            var next = function(error) {
              error.should.equal(err);
              done();
            };

            searchController(req, res, next);
          });
        });
      });
    });
  });
});
