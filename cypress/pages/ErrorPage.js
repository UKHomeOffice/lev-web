'use strict';

class ErrorPage {
  static visit(url, status = 404) {
    cy.request({ url, failOnStatusCode: false }).its('status').should('equal', status);
    cy.visit(url, { failOnStatusCode: false });
  }

  static shouldBeVisible() {
    cy.get('h1').contains('Error');
  }

  static shouldHaveStartAgainLink() {
    cy.get('a.button').contains('Start again');
  }

  static clickStartAgainLink() {
    cy.get('a.button').click();
  }
}

module.exports = ErrorPage;
