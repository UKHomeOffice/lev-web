'use strict';

const ErrorPage = require('../ErrorPage');

class AuditErrorPage extends ErrorPage {
  static visit() {
    super.visit('/audit/user-activity?from=200118&to=100118', 500);
  }

  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.get('main').contains('Error');
  }
}

module.exports = AuditErrorPage;
