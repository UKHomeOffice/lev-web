'use strict';

var proxyquire = require('proxyquire');
var reqres = require('reqres');
var _ = require('lodash');

var formSubmission = function formSubmission(extension) {
  return _.extend({
    'system-number': '',
    'surname': '',
    'forenames': '',
    'dob': ''
  }, extension);
};

describe('controllers/birth-search', function() {
  var api = {
    findBirths: sinon.stub()
  };
  var searchController = proxyquire('../../../controllers/birth-search', {
    '../api': api
  });

  it('is a function', function() {
    searchController.should.be.a('function');
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

        res.render.should.have.been.calledWith('pages/birth-search');
      });
    });

    describe('when there is a query string', function() {
      var req;

      beforeEach(function() {
        req = _.extend(reqres.req(), {
          body: undefined,
          headers: {
            'X-Auth-Token': 'access_token'
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
            url.should.equal(`/birth/details/${sysnum}?system-number=${sysnum}`);
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
            view.should.equal('pages/birth-results');
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
              view.should.equal('pages/birth-results');
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
