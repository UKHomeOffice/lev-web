'use strict';

describe('controllers/details', function() {
  var apiRequestIDStub;
  var api;
  var detailsController;

  beforeEach(sinon.test(function() {
    apiRequestIDStub = this.stub();
    apiRequestIDStub.withArgs(1234, 'mrs-caseworker').returns(Promise.resolve({ records: [] }));
    apiRequestIDStub.withArgs(34404, 'mrs-caseworker').returns(Promise.reject('error'));

    detailsController = require('../../../controllers/details');

    api = require('../../../api');
    api.requestID = apiRequestIDStub;
  }));

  describe('when called', function() {
    var req;
    var res;
    var next;

    beforeEach(sinon.test(function() {
      req = {
        params: {
          sysnum: '1234'
        },
        headers: {
          'X-Auth-Username': 'mrs-caseworker'
        }
      };

      res = {
        render: this.spy(),
        redirect: this.spy()
      };

      next = this.spy();
    }));

    it('calls the api with the request GET params', function() {
      detailsController(req, res, next);

      api.requestID.should.have.been.calledWith(1234, 'mrs-caseworker');
    });

    it('raises an error with no GET params', function() {
      detailsController({}, res, next);

      next.should.have.been.calledWith(new ReferenceError());
    });

    describe('resolved promise', function() {

      it('renders the details page', function() {
        detailsController(req, res, next);

        return Promise.resolve().then(function() {
          res.render.should.have.been.calledWith('pages/details');
        });
      });

    });

    describe('rejected promise', function() {

      it('renders the error page', function() {
        req.params.sysnum = 'error';

        detailsController(req, res, next);

        return Promise.resolve().then(function() {
          next.should.have.been.calledWith(new Error('error'));
        });
      });

    });

  });

});
