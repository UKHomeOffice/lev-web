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

  describe('middleware functions', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      sinon.stub(api, 'findMarriageBySystemNumber');
      api.findMarriageBySystemNumber.withArgs(1234, accessToken).resolves({ records: [] });
      api.findMarriageBySystemNumber.withArgs(34404, accessToken).rejects('error');

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
    });

    afterEach(() => {
      api.findMarriageBySystemNumber.restore();
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

        api.findMarriageBySystemNumber.should.have.been.calledWith(1234, accessToken);
      });

      it('raises an error with no GET params', () => {
        detailsController({}, res, next);

        next.should.have.been.calledOnce
          .and.have.deep.property('firstCall.args[0]').that.is.an.instanceOf(ReferenceError);
      });

      describe('resolved promise', () => {
        it('renders the details page', () =>
          detailsController(req, res, next).then(() =>
            expect(res.render).to.have.been.calledWith('pages/marriage-details')
              .and.to.have.deep.property('firstCall.args[1]')
              .that.is.an('object').and.has.property('showAll').that.is.false
          )
        );

        describe('with "full-details" role', () => {
          beforeEach(() => {
            req.headers['x-auth-roles'] = role;
          });

          it('renders the full details page', () =>
            detailsController(req, res, next).then(() =>
              expect(res.render).to.have.been.calledWith('pages/marriage-details')
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
});
