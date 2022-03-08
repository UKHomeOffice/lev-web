'use strict';

const ErrorPage = require('./ErrorPage');

class SearchErrorPage extends ErrorPage {

  /**
   * Check the search error page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.get('main').contains('Not found');
  }
}

module.exports = SearchErrorPage;
