'use strict';

class ErrorPage {
  static shouldBeVisible() {
    cy.get('h1').contains('Error');
  }
}

module.exports = ErrorPage;
