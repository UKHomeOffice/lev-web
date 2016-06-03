'use strict';

var proxyquire = require('proxyquire');
var reqres = require('reqres');
var _ = require('underscore');

var formSubmission = function formSubmission(extension) {
  return _.extend({
    'system-number': '',
    'surname': '',
    'forenames': '',
    'dob': ''
  }, extension);
}

describe('controllers/search', function () {
  var api = {
    read: sinon.stub()
  };
  var searchController = proxyquire('../../../controllers/search', {
    '../api': api
  });

  it('is a function', function () {
    searchController.should.be.a('function');
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
          var query = formSubmission({
            'system-number': '1234'
          });

          req.query = query;
          api.read.withArgs(query).returns(Promise.resolve([{
            'system-number': 1234
          }]));

          searchController(req, res);

          return Promise.resolve().then(function () {
            res.redirect.should.have.been.calledWith('/details/1234?system-number=1234');
          });
        });

        it('renders the results page', function() {
          var query = formSubmission({
            'surname': 'smiths',
            'forenames': 'john',
            'dob': '01/01/2001'
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
              querystring: 'surname=smiths&forenames=john&dob=01%2F01%2F2001'
            });
          });
        });

      });

      describe('rejected promise', function() {
        it('renders the error page', function() {
          var query = formSubmission({
            'surname': 'unfoundsurname',
            'forenames': 'unfoundforenames',
            'dob': '01/01/2001'
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
              querystring: 'surname=unfoundsurname&forenames=unfoundforenames&dob=01%2F01%2F2001'
            });
          });
        });
      });
    });
  });
});
