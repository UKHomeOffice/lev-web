'use strict';

const SearchPage = require('../SearchPage');

class DeathSearchPage extends SearchPage {

  /**
   * Navigate to death registration search page
   */
  static visit() {
    cy.visit('/death');
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
   * @param dobd
   */
  static performSearch({
                         systemNumber,
                         surname,
                         forenames,
                         dobd
                       }) {
    this.setText('#system-number', systemNumber);
    this.setText('#surname', surname);
    this.setText('#forenames', forenames);
    this.setText('#dobd', dobd);
    this.submit();
  }

  static hasDateOfBirthOrDeathFocused() {
    cy.get('#dobd').should('have.focus');
  }

  static hasDateOfBirthOrDeathHint() {
    cy.get('#dobd-extended-hint').should('exist');
  }

  static hasExpectedValues({
                             systemNumber,
                             surname,
                             forenames,
                             dobd
                           }) {
    cy.get('#system-number').should('have.value', systemNumber);
    cy.get('#surname').should('have.value', surname);
    cy.get('#forenames').should('have.value', forenames);
    cy.get('#dobd').should('have.value', dobd);
  }
}

module.exports = DeathSearchPage;
