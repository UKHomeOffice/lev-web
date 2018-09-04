'use strict';

module.exports = (target) => {
  target.shouldBeOnResultsPage = function() {
    this.getText('h1').should.contain('records found for');
  };

  target.shouldBeOnBirthResultsPage = target.shouldBeOnResultsPage;
  target.shouldBeOnDeathResultsPage = target.shouldBeOnResultsPage;
  target.shouldBeOnMarriageResultsPage = target.shouldBeOnResultsPage;

  target.clickFirstRecord = function() {
    // browser.element gets just the first matching elements (browser.elements gets all matching ones)
    browser.element('#records a').click();
  };
};
