'use strict';

const Page = require('./Page');

class ErrorPage extends Page {

  /**
   * Navigate to error page
   */
  static visit(url, status = 404) {
    cy.request({ url, failOnStatusCode: false }).its('status').should('equal', status);
    cy.visit(url, { failOnStatusCode: false });
  }

  /**
   * Check the error page is visible
   */
  static shouldBeVisible() {
    cy.get('h1').contains('Error');
  }

  /**
   * Check the error page has a "Start Again" button
   */
  static shouldHaveStartAgainLink() {
    cy.get('a.button').contains('Start again');
  }

  /**
   * Click the "Start Again" button
   */
  static clickStartAgainLink() {
    cy.get('a.button').click();
  }
}

module.exports = ErrorPage;
