'use strict';

var proxyquire = require('proxyquire');

describe('controllers/search', function () {
  var Model = function () {};
  Model.prototype.read = sinon.stub();
  Model.prototype.set = sinon.stub();

  var searchController = proxyquire('../../../controllers/search', {
    '../models': Model
  });

  describe('.show()', function () {

    var req = {};
    var res = {
      render: sinon.spy()
    };

    beforeEach(function () {
      searchController.show(req, res);
    });

    it('renders the search page', function () {
      res.render.should.have.been.calledWith('pages/search');
    });

  });

  describe('.query()', function () {

    var req = {
      session: {},
      body: {}
    };
    var res = {
      locals: {},
      redirect: sinon.spy()
    };
    var promise;

    describe('when the model returns a single record', function () {

      beforeEach(function () {
        Model.prototype.read.returns(Promise.resolve({records: [1]}));
        promise = searchController.query(req, res);
      });

      it('redirects to the details page ', function (done) {
        return promise.then(function (data) {
          res.redirect.should.have.been.calledWith('/details');
          done();
        });
      });

    });

    describe('model returns many records', function () {

      beforeEach(function () {
        Model.prototype.read.returns(Promise.resolve({records: [1,2,3]}));
        promise = searchController.query(req, res);
      });

      it('redirects to the results page ', function (done) {
        return promise.then(function () {
          res.redirect.should.have.been.calledWith('/results');
          done();
        });
      });

    });

    describe('with errors', function () {
      var message = 'Error message';

      beforeEach(function () {
        Model.prototype.read.returns(Promise.reject(message));
        promise = searchController.query(req, res);
      });

      it('handles the error', function (done) {
        return promise.catch(function (error) {
          error.should.be.instanceof(Error);
          error.message.should.equal(message)
          done();
        })
      });
    });

  });

});
