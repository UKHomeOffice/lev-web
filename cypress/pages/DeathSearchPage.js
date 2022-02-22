'use strict';

const SearchPage = require('./SearchPage');

class DeathSearchPage extends SearchPage {

  /**
   * Navigate to death registration search page
   */
  static visit() {
    cy.visit('/death');
    DeathSearchPage.shouldBeVisible();
  }

  /**
   * Check death registrations search page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('Applicant\'s details');

    // Has focus
    cy.get('#system-number').should('have.focus');

    // Has labels
    cy.get('label[for=system-number]').contains('System number from death certificate');
    cy.get('label[for=surname]').contains('Surname');
    cy.get('label[for=forenames]').contains('Forename(s)');
    cy.get('label[for=dobd]').contains('Date of birth or death');
  }

  /**
   * Perform a death registration search with the given params
   *
   * @param systemNumber
   * @param surname
   * @param forenames
   * @param dob
   */
  static performSearch(systemNumber = '', surname = '', forenames = '', dob = '') {

    // System Number
    if (systemNumber !== '') {
      cy.get('#system-number').type(systemNumber);
    }

    // Surname
    if (surname !== '') {
      cy.get('#surname').type(surname);
    }

    // Forename(s)
    if (forenames !== '') {
      cy.get('#forenames').type(forenames);
    }

    // DOB
    if (dob !== '') {
      cy.get('#dob').type(dob);
    }

    // Submit
    cy.get('input[type="submit"]').click();
  }
}

module.exports = DeathSearchPage;
