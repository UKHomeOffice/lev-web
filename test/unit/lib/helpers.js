'use strict';

const role = require('../../../config').fullDetailsRoleName;
const helpers = require('../../../lib/helpers');

describe('helpers', () => {
  describe('showFullDetails', () => {
    const showFullDetails = helpers.showFullDetails;

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
