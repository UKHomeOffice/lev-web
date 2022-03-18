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

  /**
   * Check expected rows are displayed
   *
   * @param expected
   */
  static hasExpectedRows(expected) {
    const { results } = expected;

    cy.get('#records li').each((element, index) => {
      const { dateOfMarriage, placeOfMarriage } = results[index];

      cy.wrap(element).contains('tr', `Date of marriage ${dateOfMarriage}`);
      cy.wrap(element).contains('tr', `Place of marriage ${placeOfMarriage.short}`);
    });
  }
}

module.exports = MarriageResultsPage;
