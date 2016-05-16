'use strict';

describe('controllers/results', sinon.test(function () {
  var apiReadStub;
  var api;
  var resultsController;
  var err = new Error();
  var records = [
    {
      surname: 'smith'
    },
    {
      surname: 'smith'
    }
  ];

  beforeEach(sinon.test(function () {
    apiReadStub = this.stub();
    apiReadStub.withArgs({'system-number': '1234'}).returns(Promise.resolve([{
      'system-number': 1234
    }]));
    apiReadStub.withArgs({'surname': 'smiths'}).returns(Promise.resolve(records));
    apiReadStub.withArgs({'surname': 'unfoundsurname'}).returns(Promise.reject({
      name: 'NotFoundError'
    }));
    apiReadStub.withArgs({'surname': 'someerrorgenerated'}).returns(Promise.reject(err));

    resultsController = require('../../../controllers/results').query;

    api = require('../../../api');
    api.read = apiReadStub;
  }));

  describe('when called', function() {
    var req;
    var res;

    beforeEach(sinon.test(function() {
      req = {
        query: {
          surname: 'smiths'
        },
        headers: {
          'X-Auth-Username': 'mrs-caseworker'
        }
      };

      res = {
        render: this.spy(),
        redirect: this.spy()
      };
    }));

    it('calls the api with the request GET params', function() {
      resultsController(req, res);

      api.read.should.have.been.calledWith(req.query);
    });

    it('redirects to / with no GET params', function () {
      resultsController({}, res);

      res.redirect.should.have.been.calledWith('/');
    });

    describe('resolved promise', function() {

      it('redirects to the details page on one record returned', function() {
        delete req.query.surname;
        req.query['system-number'] = '1234';

        resultsController(req, res);

        return Promise.resolve().then(function () {
          res.redirect.should.have.been.calledWith('/details/1234');
        });
      });

      it('renders the results page', function() {
        resultsController(req, res);

        return Promise.resolve().then(function () {
          res.render.should.have.been.calledWith('pages/results', {
            count: 2,
            records: records,
            query: {surname: 'smiths'},
            querystring: 'surname=smiths'
          });
        });
      });

    });

    describe('rejected promise', function() {

      it('renders the error page', function() {
        req.query.surname = 'unfoundsurname';

        resultsController(req, res);

        return Promise.resolve().then(function () {
          res.render.should.have.been.calledWith('pages/results', {
            count: 0,
            records: null,
            query: {surname: 'unfoundsurname'},
            querystring: 'surname=unfoundsurname'
          });
        });
      });

      it('calls next with the error if it\'s an unknown Error', sinon.test(function () {
        var next = this.spy();

        req.query.surname = 'someerrorgenerated';

        resultsController(req, res, next);

        return Promise.resolve().then(function () {
          next.should.have.been.calledWith(err);
        });
      }));

    });
  });

}));
