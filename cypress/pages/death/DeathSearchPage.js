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

  static hasNoSearchCriteria() {
    cy.get('h2').contains('Fix the following errors');
    cy.get('a').contains('Please enter a surname');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('a').contains('Please enter a date');
    cy.get('#dobd-extended-hint').should('exist');
    cy.get('#surname').should('have.focus');
  }

  static hasInvalidSystemNumber(message) {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains(message);
    cy.get('#system-number-hint').should('exist');
  }

  static hasMissingForenames() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('#forenames').should('have.focus');
  }

  static hasMissingForenamesAndSurname() {
    cy.get('h2').contains('Fix the following errors');
    cy.get('a').contains('Please enter a surname');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('#surname').should('have.focus');
  }

  static hasInvalidDate() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a date in the correct format');
    cy.get('#dobd-extended-hint').should('exist');
    cy.get('#dobd').should('have.focus');
  }

  static hasDateInFuture() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a date in the past');
    cy.get('#dobd-extended-hint').should('exist');
    cy.get('#dobd').should('have.focus');
  }
}

module.exports = DeathSearchPage;
