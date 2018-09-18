'use strict';

module.exports = (target) => {
  target.shouldBeOnDetailsPage = function() {
    this.getUrl().should.contain('/details');
  };

  target.shouldBeOnBirthDetailsPage = target.shouldBeOnDetailsPage;

  target.shouldBeOnDeathDetailsPage = function() {
    this.getUrl().should.contain('/death/details');
  };

  target.shouldBeOnMarriageDetailsPage = function() {
    this.getUrl().should.contain('/marriage/details');
  };
};
