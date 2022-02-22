'use strict';

const ResultsPage = require('./ResultsPage');

class DeathResultsPage extends ResultsPage {

  /**
   * Check death registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/death');
  }
}

module.exports = DeathResultsPage;
