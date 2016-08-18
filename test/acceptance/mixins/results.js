'use strict';

module.exports = (target) => {
  target.shouldBeOnResultsPage = function() {
    this.getText('h1').should.contain('records found for');
  };
};
