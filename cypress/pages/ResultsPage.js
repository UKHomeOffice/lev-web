'use strict';

class ResultsPage {

  /**
   * Check results page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('records found for');
  }
}

module.exports = ResultsPage;
