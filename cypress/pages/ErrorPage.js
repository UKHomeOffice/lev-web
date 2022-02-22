'use strict';

class ErrorPage {
  static shouldBeVisible() {
    cy.get('h1').contains('Error');
  }

  /**
   * Check the 404 Not Found page is visible
   */
  static shouldBeOn404Page() {
    this.shouldBeVisible();
    cy.get('main').contains('Not found');
  }
}

module.exports = ErrorPage;
