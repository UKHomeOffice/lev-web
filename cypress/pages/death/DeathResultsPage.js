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
   * Check expected rows are displayed
   *
   * @param expected
   */
  static hasExpectedRows(expected) {
    const { results } = expected;

    cy.get('#records li').each((element, index) => {
      const { dateOfBirth, address, dateOfDeath } = results[index].deceased;

      cy.wrap(element).contains('tr', `Date of birth ${dateOfBirth}`);
      cy.wrap(element).contains('tr', `Address ${address}`);
      cy.wrap(element).contains('tr', `Date of death ${dateOfDeath}`);
    });
  }

  static clickFirstRecord() {
    cy.get('#records a').eq(0).click();
  }
}

module.exports = DeathResultsPage;
