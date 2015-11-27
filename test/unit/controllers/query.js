'use strict';

var proxyquire = require('proxyquire');

describe('controllers/query', function () {
  var Model = function () {};
  Model.prototype.get = sinon.stub();

  var queryController = proxyquire('../../../controllers/query', {
    '../models': Model
  });

  describe('.show()', function () {

    var req = {};
    var res = {
      render: sinon.spy()
    };

    beforeEach(function () {
      queryController.show(req, res);
    });

    it('renders the query page', function () {
      res.render.should.have.been.calledWith('pages/query');
    });

  });

  describe('.get()', function () {

    var req = {
      body: {}
    };
    var res = {
      locals: {},
      redirect: sinon.spy()
    };
    var promise;

    describe('model returns a single record', function () {

      beforeEach(function () {
        Model.prototype.get.returns(Promise.resolve({records: [1]}));
        promise = queryController.get(req, res);
      });

      it('redirects to the details page ', function (done) {
        return promise.then(function (data) {
          res.locals.should.have.property('records').and.equal(1);
          res.redirect.should.have.been.calledWith('/details');
          done();
        });
      });

    });

    describe('model returns many records', function () {

      beforeEach(function () {
        Model.prototype.get.returns(Promise.resolve({records: [1,2,3]}));
        promise = queryController.get(req, res);
      });

      it('redirects to the list page ', function (done) {
        return promise.then(function () {
          res.locals.should.have.property('records').and.deep.equal([1,2,3]);
          res.redirect.should.have.been.calledWith('/list');
          done();
        });
      });

    });

    describe('with errors', function () {
      var message = 'Error message';

      beforeEach(function () {
        Model.prototype.get.returns(Promise.reject(message));
        promise = queryController.get(req, res);
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
