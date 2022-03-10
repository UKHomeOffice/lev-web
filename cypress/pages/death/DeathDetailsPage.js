'use strict';

const DetailsPage = require('../DetailsPage');

class DeathDetailsPage extends DetailsPage {

  /**
   * Check death registrations details page is visible
   */
  static shouldBeVisible() {
    cy.url().should('include', '/death/details');
  }

  /**
   * Check death registrations details page has the expected result
   */
  static hasTitle(title) {
    cy.get('h1').contains(title);
  }
}

module.exports = DeathDetailsPage;
