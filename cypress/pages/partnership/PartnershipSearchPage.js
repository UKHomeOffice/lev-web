'use strict';

const SearchPage = require('../SearchPage');
const conf = require("../../../fields/partnership");

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

  static noSearchCriteria() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a surname');
    cy.get('.validation-summary a').contains('Please enter at least one forename');
    cy.get('.validation-summary a').contains('Please enter a date of civil partnership');
  }

  static noSystemNumber() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a number');
    cy.get('#system-number-hint').should('exist');
  }

  static invalidLengthSystemNumber() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('The system number should be 9 digits');
    cy.get('#system-number-hint').should('exist');
  }

  static noForenames() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter at least one forename');
    cy.get('input[name="forenames"]').should('have.focus');
  }

  static noSurname() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a surname');
    cy.get('.validation-summary a').contains('Please enter at least one forename');
    cy.get('input[name="surname"]').should('have.focus');
  }

  static invalidDOP() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a date of civil partnership in the correct format');
    cy.get('#dop-extended-hint').should('exist');
    cy.get('input[name="dop"]').should('have.focus');
  }

  static dopInFuture() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a date of civil partnership in the past');
    cy.get('#dop-extended-hint').should('exist');
  }

  static dopBeforeRecordsBegan() {
    const since = conf.dop.validate[2].arguments[0];

    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a')
      .contains(`Please enter a date after our records began (${since.format('D MMMM YYYY')})`);
    cy.get('#dop-extended-hint').should('exist');
  }

  static searchFormClear() {
    cy.get('#system-number').should('have.value', '');
    cy.get('#surname').should('have.value', '');
    cy.get('#forenames').should('have.value', '');
    cy.get('#dop').should('have.value', '');
  }

  static searchFormRetainedValues(record) {
    cy.get('#system-number').should('have.value', '');
    cy.get('#surname').should('have.value', `${record.surname}`);
    cy.get('#forenames').should('have.value', `${record.forenames}`);
    cy.get('#dop').should('have.value', `${record.dop}`);
  }
}

module.exports = PartnershipSearchPage;
