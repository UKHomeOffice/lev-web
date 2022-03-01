'use strict';

const ErrorPage = require('./ErrorPage');

class SearchErrorPage extends ErrorPage {
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.get('main').contains('Not found');
  }
}

module.exports = SearchErrorPage;
