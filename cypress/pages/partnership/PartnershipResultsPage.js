'use strict';

const ResultsPage = require('../ResultsPage');

class PartnershipResultsPage extends ResultsPage {

  /**
   * Check partnership registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/partnership');
  }
}

module.exports = PartnershipResultsPage;
