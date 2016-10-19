'use strict';

const rewire = require('rewire');
const detailsController = rewire('../../../controllers/details');
const api = detailsController.__get__('api'); // eslint-disable-line no-underscore-dangle

describe('controllers/details', function() {
  var req;
  var res;
  var next;

  beforeEach(sinon.test(function() {
    var apiFindBySystemNumberStub = this.stub();
    apiFindBySystemNumberStub.withArgs(1234, 'mrs-caseworker').returns(Promise.resolve({ records: [] }));
    apiFindBySystemNumberStub.withArgs(34404, 'mrs-caseworker').returns(Promise.reject('error'));
    api.findBySystemNumber = apiFindBySystemNumberStub;

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

  describe('handleError function', () => {
    const fn = detailsController.__get__('handleError'); // eslint-disable-line no-underscore-dangle

    it('should pass through to the standard not found error handler on 404', () => {
      const err = new Error('404 Not Found');
      err.name = 'NotFoundError';
      fn(err, next);
      expect(next).to.have.been.calledWithExactly();
    });

    it('should pass through to the standard error handler when a specific error occurs', () => {
      const err = new Error('Any old error');
      fn(err, next);
      expect(next).to.have.been.calledWithExactly(err);
    });

    it('should pass through to the standard error handler and wrap non error types', () => {
      const err = 'Any old message';
      fn(err, next);
      expect(next.getCall(0).args[0])
        .to.be.an('error')
        .that.has.property('message', err);
    });
  });

  describe('when called', function() {

    it('calls the api with the request GET params', function() {
      detailsController(req, res, next);

      api.findBySystemNumber.should.have.been.calledWith(1234, 'mrs-caseworker');
    });

    it('raises an error with no GET params', function() {
      detailsController({}, res, next);

      next.should.have.been.calledWith(new ReferenceError());
    });

    describe('resolved promise', function() {

      it('renders the details page', () =>
        detailsController(req, res, next).then(() =>
          expect(res.render).to.have.been.calledWith('pages/details')
        )
      );

    });

    describe('rejected promise', function() {

      it('renders the error page', function() {
        req.params.sysnum = '34404';
        detailsController(req, res, next).then(() =>
          expect(next).to.have.been.calledWith(new Error('error'))
        );
      });

    });

  });

});
