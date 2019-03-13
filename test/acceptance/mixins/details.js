'use strict';

module.exports = (target) => {

  /**
   * @deprecated
   */
  target.shouldBeOnDetailsPage = function() {
    this.getUrl().should.contain('/details');
  };

  target.shouldBeOnBirthDetailsPage = function() {
    this.getUrl().should.contain('/birth/details');
  };

  target.shouldBeOnDeathDetailsPage = function() {
    this.getUrl().should.contain('/death/details');
  };

  target.shouldBeOnMarriageDetailsPage = function() {
    this.getUrl().should.contain('/marriage/details');
  };
};
