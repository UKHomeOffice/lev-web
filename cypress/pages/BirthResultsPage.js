'use strict';

class BirthResultsPage {

  /**
   * Check birth registrations results page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('records found for');
  }
}

module.exports = BirthResultsPage;
