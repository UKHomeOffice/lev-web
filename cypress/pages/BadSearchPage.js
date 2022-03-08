'use strict';

const ErrorPage = require('./ErrorPage');

class BadSearchPage extends ErrorPage {
  static visit(url) {
    cy.request({ url, failOnStatusCode: false }).its('status').should('equal', 404);
    cy.visit(url, { failOnStatusCode: false });
  }

  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.get('main').contains('Not found');
  }
}

module.exports = BadSearchPage;
