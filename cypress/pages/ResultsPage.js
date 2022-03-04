'use strict';

const Page = require('./Page');

class ResultsPage extends Page {

  /**
   * Check results page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('records found for');
  }
}

module.exports = ResultsPage;
