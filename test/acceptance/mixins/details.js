'use strict';

module.exports = (target) => {
  target.shouldBeOnDetailsPage = function() {
    this.getUrl().should.contain('/details');
  };
};
