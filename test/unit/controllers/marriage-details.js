'use strict';

const rewire = require('rewire');
const detailsController = rewire('../../../controllers/marriage-details');
const api = detailsController.__get__('api'); // eslint-disable-line no-underscore-dangle
const role = require('../../../config').fullDetailsRoleName; // eslint-disable-line no-underscore-dangle

const accessToken = 'accessToken';

describe('controllers/marriage-details', function() {
  describe('support function', () => {
    describe('showFullDetails', () => {
      const showFullDetails = detailsController.__get__('showFullDetails'); // eslint-disable-line no-underscore-dangle

      it('should be a single parameter function', () => expect(showFullDetails).to.be.a('function').with.lengthOf(1));
      it('should return false when roles does not exist', () => expect(() => showFullDetails()).to.throw(TypeError));
      it('should return false when there are no roles', () => expect(showFullDetails({ roles: [] })).to.be.false);
      it('should return false when roles does not include "full-data"', () =>
        expect(showFullDetails({ roles: ['blaa', 'blee', 'bloo'] })).to.be.false);
      it(`should return true when roles includes "${role}"`, () =>
        expect(showFullDetails({ roles: ['blaa', role, 'bloo'] })).to.be.true);
      it(`should return true when only role is "${role}"`, () =>
        expect(showFullDetails({ roles: [role] })).to.be.true);
    });
  });

  let req;
  let res;
  let next;

  beforeEach(sinon.test(function() {
    const apiFindBySystemNumberStub = this.stub();
    apiFindBySystemNumberStub.withArgs(1234, accessToken).returns(Promise.resolve({ records: [] }));
    apiFindBySystemNumberStub.withArgs(34404, accessToken).returns(Promise.reject('error'));
    api.findMarriageBySystemNumber = apiFindBySystemNumberStub;

    req = {
      params: {
        sysnum: '1234'
      },
      headers: {
        'x-auth-token': accessToken
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

  describe('renderDetails function', function() {
    it('calls the api with the request GET params', function() {
      detailsController(req, res, next);

      api.findMarriageBySystemNumber.should.have.been.calledWith(1234, accessToken);
    });

    it('raises an error with no GET params', function() {
      detailsController({}, res, next);

      next.should.have.been.calledWith(new ReferenceError());
    });

    describe('resolved promise', function() {
      it('renders the details page', () =>
        detailsController(req, res, next).then(() =>
          expect(res.render).to.have.been.calledWith('pages/marriage-details')
            .and.to.have.deep.property('args[0][1]').that.is.an('object').and.has.property('showAll').that.is.false
        )
      );

      describe('with "full-details" role', () => {
        beforeEach(() => {
          req.headers['x-auth-roles'] = role;
        });

        it('renders the full details page', () =>
          detailsController(req, res, next).then(() =>
            expect(res.render).to.have.been.calledWith('pages/marriage-details')
              .and.to.have.deep.property('args[0][1]').that.is.an('object').and.has.property('showAll').that.is.true
          )
        );
      });
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
