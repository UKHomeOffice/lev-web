'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class ResultsPage extends BackToSearchPage {

  /**
   * Check results page is visible
   */
  static shouldBeVisible() {
    cy.get('h1').contains('records found for');
  }

  /**
   * Click the first record
   */
  static clickFirstRecord() {
    cy.get('#records a').eq(0).click();
  }
}

module.exports = ResultsPage;
