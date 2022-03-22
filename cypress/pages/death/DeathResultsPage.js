'use strict';

const ResultsPage = require('../ResultsPage');

class DeathResultsPage extends ResultsPage {

  /**
   * Check death registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/death');
  }

  /**
   * Check expected title is displayed
   *
   * @param expected
   */
  static hasExpectedTitle(expected) {
    const { search, results } = expected;
    const title = `${results.length === 0 ? 'No' : results.length} records found for ${search.forenames} ${search.surname} ${search.dobd}`;

    cy.get('h1').contains(title);
  }

  /**
   * Check expected results are displayed
   *
   * @param results
   */
  static hasExpectedResults(results) {
    cy.get('#records li').each((element, index) => {
      const { deceased } = results[index];

      cy.wrap(element).contains('a h2', `${deceased.forenames} ${deceased.surname}`);
      cy.wrap(element).contains('tr', `Date of birth ${deceased.dateOfBirth}`);
      cy.wrap(element).contains('tr', `Address ${deceased.address}`);
      cy.wrap(element).contains('tr', `Date of death ${deceased.dateOfDeath}`);
    });
  }
}

module.exports = DeathResultsPage;
