'use strict';

const ResultsPage = require('../ResultsPage');

class MarriageResultsPage extends ResultsPage {

  /**
   * Check marriage registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/marriage');
  }
}

module.exports = MarriageResultsPage;
