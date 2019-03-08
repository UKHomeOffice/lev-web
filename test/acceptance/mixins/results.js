'use strict';

module.exports = (target) => {
  target.shouldBeOnResultsPage = function() {
    this.getText('h1').should.contain('records found for');
  };

  target.shouldBeOnBirthResultsPage = function() {
    this.getUrl().should.contain('/birth');
    target.shouldBeOnResultsPage;
  };

  target.shouldBeOnDeathResultsPage = function() {
    this.getUrl().should.contain('/death');
    target.shouldBeOnResultsPage();
  };

  target.shouldBeOnMarriageResultsPage = function() {
    this.getUrl().should.contain('/marriage');
    target.shouldBeOnResultsPage();
  };

  target.clickFirstRecord = function() {
    // browser.element gets just the first matching elements (browser.elements gets all matching ones)
    browser.element('#records a').click();
  };
};
