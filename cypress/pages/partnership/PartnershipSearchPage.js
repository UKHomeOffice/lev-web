'use strict';

const SearchPage = require('../SearchPage');

class PartnershipSearchPage extends SearchPage {

  /**
   * Navigate to partnership registration search page
   */
  static visit() {
    cy.visit('/partnership');
  }

  /**
   * Check partnership registrations search page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('Applicant\'s details');

    // Has focus
    cy.get('#system-number').should('have.focus');

    // Has labels
    cy.get('label[for=system-number]').contains('System number from civil partnership certificate');
    cy.get('label[for=surname]').contains('Surname');
    cy.get('label[for=forenames]').contains('Forename(s)');
    cy.get('label[for=dop]').contains('Date of civil partnership');
  }

  /**
   * Perform a partnership registration search with the given params
   *
   * @param systemNumber
   * @param surname
   * @param forenames
   * @param dop
   */
  static performSearch({
                         systemNumber,
                         surname,
                         forenames,
                         dop
                       }) {
    this.setText('#system-number', systemNumber);
    this.setText('#surname', surname);
    this.setText('#forenames', forenames);
    this.setText('#dop', dop);
    this.submit();
  }
}

module.exports = PartnershipSearchPage;
