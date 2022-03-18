'use strict';

const SearchPage = require('../SearchPage');

class MarriageSearchPage extends SearchPage {

  /**
   * Navigate to marriage registration search page
   */
  static visit() {
    cy.visit('/marriage');
  }

  /**
   * Check marriage registrations search page is visible
   */
  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('Applicant\'s details');

    // Has focus
    cy.get('#system-number').should('have.focus');

    // Has labels
    cy.get('label[for=system-number]').contains('System number from marriage certificate');
    cy.get('label[for=surname]').contains('Surname');
    cy.get('label[for=forenames]').contains('Forename(s)');
    cy.get('label[for=dom]').contains('Date of marriage');
  }

  /**
   * Perform a marriage registration search with the given params
   *
   * @param systemNumber
   * @param surname
   * @param forenames
   * @param dom
   */
  static performSearch({
                         systemNumber,
                         surname,
                         forenames,
                         dom
                       }) {
    this.setText('#system-number', systemNumber);
    this.setText('#surname', surname);
    this.setText('#forenames', forenames);
    this.setText('#dom', dom);
    this.submit();
  }

  /**
   * Check the date of marriage field has focus
   */
  static hasDateOfMarriageFocused() {
    cy.get('#dom').should('have.focus');
  }

  /**
   * Check the date of marriage hint is visible
   */
  static hasDateOfMarriageHint() {
    cy.get('#dom-extended-hint').should('exist');
  }

  /**
   * Check the search page has the expected values
   *
   * @param systemNumber
   * @param surname
   * @param forenames
   * @param dom
   */
  static hasExpectedValues({
                             systemNumber,
                             surname,
                             forenames,
                             dom
                           }) {
    cy.get('#system-number').should('have.value', systemNumber);
    cy.get('#surname').should('have.value', surname);
    cy.get('#forenames').should('have.value', forenames);
    cy.get('#dom').should('have.value', dom);
  }
}

module.exports = MarriageSearchPage;
