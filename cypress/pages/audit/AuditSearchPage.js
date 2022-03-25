'use strict';

const SearchPage = require('../SearchPage');
const moment = require("moment");

class AuditSearchPage extends SearchPage {

  static visit() {
    cy.visit('/audit/user-activity');
  }

  /**
   * Check user activity search page is visible
   */
  static shouldBeVisible() {

    cy.url().should('include', '/audit/user-activity');

    // Has title
    cy.get('h1').contains('Audit information');

    // Has focus
    cy.get('#from').should('have.focus');

    // Has labels
    cy.get('label[for=from]').contains('Search from');
    cy.get('label[for=to]').contains('Search to');
  }

  static generateReport(record) {
    const { from, to, user } = record;
      this.setText('#from', from);
      this.setText('#to', to);
      this.setText('#user', user);
      this.submit();
  }
  static noRecordsFound(record) {
    const { from, to, user } = record;
    const userMessage = user && `for \'${user}\' `;
    cy.get('h2').contains(`No usage data ${userMessage}found between ${from} and ${to}`);
  }

  static validRecordFound(record) {
    const { from, to, user } = record;
    return user ? cy.get('h2').contains(`Showing audit data for \'${user}\' from ${from}, to ${to}`) :
      cy.get('h2').contains(`Showing audit data from ${from}, to ${to}`);
  }

  static weekDayRecordsDisplayed(record) {
    const days = 7;
    const { from } = record;
    const isWeekend = date => date.format('ddd')[0].toLowerCase() === 's';
    const cursor = moment(from, 'DD/MM/YYYY');
    let i = 0;
    while (i++ < days) {
      if (isWeekend(cursor)) {
        cy.get('table.audit > thead > tr > th').contains(cursor.format('D MMM YYYY')).should('not.be.visible');
      } else {
        cy.get('table.audit > thead > tr > th').contains(cursor.format('D MMM YYYY')).should('be.visible');
      }
      cursor.add(1, 'days');
    }
    cy.get('table.audit > thead > tr > th').contains('Period total');
  }

  static weekDayandWeekendRecordsDisplayed(record) {
    const days = 7;
    const { from } = record;
    const cursor = moment(from, 'DD/MM/YYYY');
    let i = 0;
    while (i++ < days) {
      cy.get('table.audit > thead > tr > th').contains(cursor.format('D MMM YYYY')).should('be.visible');
      cursor.add(1, 'days');
    }
    cy.get('table.audit > thead > tr > th').contains('Period total');
  }

  static toggleWeekendViewCheckbox() {
    cy.get('#weekends').click();
  }

  static checkboxTicked(ticked = false) {
    cy.get('#weekends').should(ticked ? 'be.checked' : 'not.be.checked');
    return ticked;
  }

  static userDisplayed(user) {
    cy.get('table.audit > tbody > tr > th').contains(String(user));
  }

  static columnForEachDayWithCount() {
    cy.get('table.audit > tbody > tr:first > th ~ td').should('have.length', 8);
  }

  static lastRowDayTotals() {
    cy.get('table.audit > tbody > tr:last > th').contains('Day totals');
  }

  static periodTotalsAccurate() {
    const toStrings = (cells$) => Cypress._.map(cells$, 'textContent')
    const toNumbers = (texts) => Cypress._.map(texts, Number)
    const sum = (numbers) => Cypress._.sum(numbers)

    cy.get('table.audit > tbody > tr:first > th ~ td')
      .then(toStrings)
      .then(toNumbers)
      .then(sum)
      .then(cellsTotal => {
        cy.get('table.audit > tbody > tr:first > th ~ td:last')
          .then(toStrings)
          .then(toNumbers)
          .then(sum)
          .should('eq', cellsTotal / 2)  // after data transformed, simple assertion
      })
  }

  static dayTotalsAccurate() {
    const toStrings = (cells$) => Cypress._.map(cells$, 'textContent');
    const toNumbers = (texts) => Cypress._.map(texts, Number);
    const sum = (numbers) => Cypress._.sum(numbers);

    cy.get('table.audit > tbody > tr > th + td')
      .then(toStrings)
      .then(toNumbers)
      .then(sum)
      .then(cellsTotal => {
        cy.get('table.audit > tbody > tr > th + td:last')
          .then(toStrings)
          .then(toNumbers)
          .then(sum)
          .should('eq', cellsTotal / 2)  // after data transformed, simple assertion
      })
  }

  static downloadLinkDisplayed() {
    cy.get('a#save').should('exist');
  }

  static downloadLink(record) {
    const { from, to, user } = record;
    const fromDshd = moment(from, 'DD/MM/YYYY').format('DD-MM-YY');
    const toDshd = moment(to, 'DD/MM/YYYY').format('DD-MM-YY');

    return user ? cy.get('a#save').invoke('attr', 'download').should('eq', `audit_report_for_${user}_${fromDshd}_to_${toDshd}.csv`) :
    cy.get('a#save').invoke('attr', 'download').should('eq', `audit_report_${fromDshd}_to_${toDshd}.csv`);
  }

  static singleRecordDisplayed() {
      cy.get('table.audit > tbody > tr').should('have.length', 2);
    }

  static noDateSearchCriteria() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a date to search from');
    cy.get('.validation-summary a').contains('Please enter a date to search up to');
  }

  static invalidDates() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter the "from" date in the correct format');
    cy.get('.validation-summary a').contains('Please enter the "to" date in the correct format');
  }

  static dateInFuture() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please enter a date in the past');
  }

  static fromDateAfterToDate() {
    cy.get('header > h1').contains('Error');
    cy.get('p').contains('"from" date must be before "to" date for the User Activity report');
  }

  static exceedMaxRange(days) {
    cy.get('header > h1').contains('Error');
    cy.get('p').contains(`maximum date range exceeded (should be less than ${days} days)`);
  }

  static userInvalidCharacters() {
    cy.get('.validation-summary h2').contains('Fix the following error');
    cy.get('.validation-summary a').contains('Please only use characters that can be used for an email address: a-z, A-Z, 0-9, or \'_%-@.\'');
  }
}

module.exports = AuditSearchPage;
