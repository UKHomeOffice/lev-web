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
   * Check death registrations results page has expected title
   *
   * @param title
   */
  static hasTitle(title) {
    cy.get('h1').contains(title);
  }

  static hasExpectedResult(result) {
    cy.get('#records li').each((element, index) => {
      const { dateOfBirth, address, dateOfDeath } = result[index].deceased;

      cy.wrap(element).contains('tr', `Date of birth ${dateOfBirth}`);
      cy.wrap(element).contains('tr', `Address ${address}`);
      cy.wrap(element).contains('tr', `Date of death ${dateOfDeath}`);
    });
  }

  static hasNewSearchLink() {
    cy.get('#newSearchLink').should('exist');
  }

  static hasEditSearchLink() {
    cy.get('#editSearchLink').should('exist');
  }
}

module.exports = DeathResultsPage;
