'use strict';

const SearchPage = require('../SearchPage');
const conf = require('../../../fields');

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

  static noSearchCriteria() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a surname');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('a').contains('Please enter a date of birth');
  }

  static noSystemNumber() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a number');
    cy.get('#system-number-hint').should('exist');
  }

  static invalidLengthSystemNumber() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('The system number should be 9 digits');
    cy.get('#system-number-hint').should('exist');
  }

  static noForenames() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('input[name="forenames"]').should('have.focus');
  }

  static noSurname() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a surname');
    cy.get('a').contains('Please enter at least one forename');
    cy.get('input[name="surname"]').should('have.focus');
  }

  static invalidDOB() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a date of birth in the correct format');
    cy.get('#dob-extended-hint').should('exist');
    cy.get('input[name="dob"]').should('have.focus');
  }

  static dobInFuture() {
    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains('Please enter a date of birth in the past');
    cy.get('#dob-extended-hint').should('exist');
  }

  static dobBeforeRecordsBegan() {
    const since = conf.dob.validate[2].arguments[0];

    cy.get('h2').contains('Fix the following error');
    cy.get('a').contains(`Please enter a date after our records began (${since.format('D MMMM YYYY')})`);
    cy.get('#dob-extended-hint').should('exist');
  }

  static searchFormClear() {
    cy.get('#system-number').should('have.value', '');
    cy.get('#surname').should('have.value', '');
    cy.get('#forenames').should('have.value', '');
    cy.get('#dob').should('have.value', '');
  }

  static searchFormRetainedValues(record) {
    cy.get('#system-number').should('have.value', '');
    cy.get('#surname').should('have.value', `${record.name.surname}`);
    cy.get('#forenames').should('have.value', `${record.name.givenName}`);
    cy.get('#dob').should('have.value', `${record.dateOfBirth}`);
  }
}

module.exports = BirthSearchPage;
