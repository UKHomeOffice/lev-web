'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class ResultsPage extends BackToSearchPage {

  /**
   * Check results page is visible
   */
  static shouldBeVisible() {
    cy.get('h1').contains('records found for');
  }
}

module.exports = ResultsPage;
