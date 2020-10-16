'use strict';

const rewire = require('rewire');
const detailsController = rewire('../../../controllers/partnership-details');
const reqInfo = require('../../../lib/req-info');
const api = detailsController.__get__('api'); // eslint-disable-line no-underscore-dangle
const role = require('../../../config').fullDetailsRoleName;

const accessToken = 'accessToken';

describe('controllers/partnership-details', function() {
  let ri;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        sysnum: '1234'
      },
      headers: {
        'x-auth-token': accessToken
      }
    };
    res = {
      render: sinon.spy(),
      redirect: sinon.spy()
    };
    next = sinon.spy();
    ri = reqInfo(req);

    sinon.stub(api, 'findPartnershipBySystemNumber');
    api.findPartnershipBySystemNumber.withArgs(1234, ri).resolves({ records: [] });
    api.findPartnershipBySystemNumber.withArgs(34404, ri).rejects('error');
  });

  afterEach(() => {
    api.findPartnershipBySystemNumber.restore();
  });

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

  describe('renderDetails function', () => {
    it('calls the api with the request GET params', () => {
      detailsController(req, res, next);

      api.findPartnershipBySystemNumber.should.have.been.calledWith(1234, ri);
    });

    it('raises an error with no GET params', () => {
      detailsController({}, res, next);

      next.should.have.been.calledOnce
        .and.have.deep.property('firstCall.args[0]').that.is.an.instanceOf(ReferenceError);
    });

    it('raises an error when system number is not an integer', () => {
      req.params.sysnum = 'pi';
      detailsController(req, res, next);

      next.should.have.been.calledOnce
        .and.have.deep.property('firstCall.args[0]').that.is.an.instanceOf(TypeError);
    });

    describe('resolved promise', () => {
      it('renders the details page', () =>
        detailsController(req, res, next).then(() =>
          expect(res.render).to.have.been.calledWith('pages/partnership-details')
            .and.to.have.deep.property('firstCall.args[1]')
            .that.is.an('object').and.has.property('showAll').that.is.false
        )
      );

      describe('with "full-details" role', () => {
        beforeEach(() => {
          req.headers['x-auth-roles'] = role;
          ri = reqInfo(req);
          api.findPartnershipBySystemNumber.withArgs(1234, ri).resolves({ records: [] });
          api.findPartnershipBySystemNumber.withArgs(34404, ri).rejects('error');
        });

        it('renders the full details page', () =>
          detailsController(req, res, next).then(() =>
            expect(res.render).to.have.been.calledWith('pages/partnership-details')
              .and.to.have.deep.property('firstCall.args[1]')
              .that.is.an('object').and.has.property('showAll').that.is.true
          )
        );
      });
    });

    describe('rejected promise', () => {
      beforeEach(() => {
        req.params.sysnum = '34404';
      });

      it('renders the error page', () =>
        detailsController(req, res, next).then(() =>
          expect(next).to.have.been.calledOnce
            .and.have.deep.property('firstCall.args[0]').that.is.an.instanceOf(Error)
        )
      );
    });
  });
});
