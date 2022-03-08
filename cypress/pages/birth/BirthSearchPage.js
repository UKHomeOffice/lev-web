'use strict';

const SearchPage = require('../SearchPage');

class BirthSearchPage extends SearchPage {

  /**
   * Navigate to birth registration search page
   */
  static visit() {
    cy.visit('/');
  }

  /**
   * Check birth registrations search page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('Applicant\'s details');

    // Has focus
    cy.get('#system-number').should('have.focus');

    // Has labels
    cy.get('label[for=system-number]').contains('System number from birth certificate');
    cy.get('label[for=surname]').contains('Surname');
    cy.get('label[for=forenames]').contains('Forename(s)');
    cy.get('label[for=dob]').contains('Date of birth');
  }

  /**
   * Perform a birth registration search with the given params
   *
   * @param systemNumber
   * @param surname
   * @param forenames
   * @param dob
   */
  static performSearch({
                         systemNumber,
                         surname,
                         forenames,
                         dob
                       }) {
    this.setText('#system-number', systemNumber);
    this.setText('#surname', surname);
    this.setText('#forenames', forenames);
    this.setText('#dob', dob);
    this.submit();
  }
}

module.exports = BirthSearchPage;
