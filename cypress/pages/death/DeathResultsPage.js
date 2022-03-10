'use strict';

const ResultsPage = require('../ResultsPage');

class DeathResultsPage extends ResultsPage {

  /**
   * Check death registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/death');
  }

  /**
   * Check death registrations results page has expected title
   *
   * @param title
   */
  static hasTitle(title) {
    cy.get('h1').contains(title);
  }
}

module.exports = DeathResultsPage;
