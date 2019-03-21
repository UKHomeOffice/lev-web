'use strict';

const proxyquire = require('proxyquire');
const reqres = require('reqres');
const _ = require('lodash');

const formSubmission = extension => _.extend({
  'system-number': '',
  'surname': '',
  'forenames': '',
  'dop': ''
}, extension);

describe('controllers/partnership-search', function() {
  const api = {
    findPartnerships: sinon.stub()
  };
  const searchController = proxyquire('../../../controllers/partnership-search', {
    '../api': api
  });

  it('is a function', function() {
    searchController.should.be.a('function');
  });

  describe('middleware', function() {
    let res;

    beforeEach(function() {
      res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };
    });

    describe('when there is no query string', function() {
      let req;

      beforeEach(function() {
        req = reqres.req();
      });

      it('renders the search page', function() {
        searchController(req, res);

        res.render.should.have.been.calledWith('pages/partnership-search');
      });
    });

    describe('when there is a query string', function() {
      let req;

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
          const sysnum = 123456789;
          const query = formSubmission({
            'system-number': `${sysnum}`
          });

          req.query = query;
          api.findPartnerships.withArgs(query).returns(Promise.resolve([{
            id: sysnum
          }]));

          res.redirect = function(url) {
            url.should.equal(`/partnership/details/${sysnum}?system-number=${sysnum}`);
            done();
          };

          searchController(req, res);
        });

        it('renders the results page', function(done) {
          const query = formSubmission({
            'surname': 'smiths',
            'forenames': 'john',
            'dop': '01/01/2011'
          });
          const records = [{
            surname: 'smith'
          }, {
            surname: 'smith'
          }];

          req.query = query;
          api.findPartnerships.withArgs(query).returns(Promise.resolve(records));

          res.render = function(view, locals) {
            view.should.equal('pages/partnership-results');
            locals.should.eql({
              count: 2,
              records: records,
              query: query,
              querystring: 'surname=smiths&forenames=john&dop=01%2F01%2F2011'
            });
            done();
          };

          searchController(req, res);
        });

      });

      describe('rejected promise', function() {
        let query;

        beforeEach(function() {
          query = formSubmission({
            'surname': 'unfoundsurname',
            'forenames': 'unfoundforenames',
            'dop': '01/01/2011'
          });

          req.query = query;
        });

        describe('due to not being found', function() {
          beforeEach(function() {
            api.findPartnerships.withArgs(query).returns(Promise.reject({
              name: 'NotFoundError'
            }));
          });

          it('renders the results page', function(done) {
            res.render = function(view, locals) {
              view.should.equal('pages/partnership-results');
              locals.should.eql({
                count: 0,
                records: null,
                query: query,
                querystring: 'surname=unfoundsurname&forenames=unfoundforenames&dop=01%2F01%2F2011'
              });
              done();
            };

            searchController(req, res);
          });
        });

        describe('due to any other error', function() {
          let err;

          beforeEach(function() {
            err = new Error({
              name: 'UnexpectedError'
            });
            api.findPartnerships.withArgs(query).returns(Promise.reject(err));
          });

          it('passes on to the error handler', function(done) {
            const next = function(error) {
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
