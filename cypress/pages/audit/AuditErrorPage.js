'use strict';

const ErrorPage = require('../ErrorPage');

class AuditErrorPage extends ErrorPage {

  /**
   * Navigate to user activity search error page
   */
  static visit() {
    super.visit('/audit/user-activity?from=200118&to=100118', 500);
  }

  /**
   * Check user activity search error page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.get('main').contains('Error');
  }
}

module.exports = AuditErrorPage;
