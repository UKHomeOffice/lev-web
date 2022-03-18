'use strict';

const ResultsPage = require('../ResultsPage');

class MarriageResultsPage extends ResultsPage {

  /**
   * Check marriage registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/marriage');
  }

  /**
   * Check expected title is displayed
   *
   * @param expected
   */
  static hasExpectedTitle(expected) {
    const { search, results } = expected;
    const title = `${results.length === 0 ? 'No' : results.length} records found for ${search.forenames} ${search.surname} ${search.dom}`;

    cy.get('h1').contains(title);
  }
}

module.exports = MarriageResultsPage;
