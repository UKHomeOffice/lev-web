'use strict';

describe('controllers/details', function() {
  var apiReadStub;
  var api;
  var detailsController;

  beforeEach(sinon.test(function () {
    apiReadStub = this.stub();
    apiReadStub.withArgs({'system-number': '1234'}).returns(Promise.resolve({records: []}));
    apiReadStub.withArgs({'system-number': 'error'}).returns(Promise.reject('error'));

    detailsController = require('../../../controllers/details');

    api = require('../../../api');
    api.read = apiReadStub;
  }));

  describe('when called', function() {
    var req;
    var res;

    beforeEach(sinon.test(function() {
      req = {
        params: {
          sysnum: '1234'
        }
      };

      res = {
        render: this.spy(),
        redirect: this.spy()
      };
    }));

    it('calls the api with the request GET params', function() {
      detailsController(req, res);

      api.read.should.have.been.calledWith({
        'system-number': req.params.sysnum
      });
    });

    it('redirects to / with no GET params', function () {
      detailsController({}, res);

      res.redirect.should.have.been.calledWith('/');
    });

    describe('resolved promise', function() {

      it('renders the details page', function() {
        detailsController(req, res);

        return Promise.resolve().then(function () {
          res.render.should.have.been.calledWith('pages/details');
        });
      });

    });

    describe('rejected promise', function() {

      it('renders the error page', function() {
        req.params.sysnum = 'error';

        detailsController(req, res);

        return Promise.resolve().then(function () {
          res.render.should.have.been.calledWith('pages/error');
        });
      });

    });

  });

});
