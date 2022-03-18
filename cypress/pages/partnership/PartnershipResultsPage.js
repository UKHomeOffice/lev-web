'use strict';

const ResultsPage = require('../ResultsPage');
const multipleRecords = require('../../fixtures/partnership/expected-partnership-records');

class PartnershipResultsPage extends ResultsPage {

  /**
   * Check partnership registrations results page is visible
   */
  static shouldBeVisible() {
    super.shouldBeVisible();
    cy.url().should('include', '/partnership');
  }

  static noRecordFound(record) {
    cy.get('h1').contains(`No records found for ${record.forenames} ${record.surname} ${record.dop}`);
  }

  static multipleRecordsSummary(dop) {
    const dateOfPartnership = dop ? dop : multipleRecords.result.dateOfPartnership;
    const { surname, forenames } = multipleRecords.search;

    cy.get('h1').contains(`4 records found for ${forenames} ${surname} ${dateOfPartnership}`);
  }

    static multipleRecordsFound() {
      const { placeOfPartnership, dateOfPartnership, partner1, partner2 } = multipleRecords.result;

      ResultsPage.shouldBeVisible();

      // displays a subset of each record in a list
      cy.get('ul>li').each(() => {})
        .contains(`${partner1.forenames} ${partner1.surname} & ${partner2.forenames} ${partner2.surname}`);
      cy.get('ul>li').each(() => {}).contains(`Date of civil partnership ${dateOfPartnership}`);
      cy.get('ul>li').each(() => {}).contains(`Place of civil partnership ${placeOfPartnership.short}`);
    }


  static selectFirstRecord() {
    cy.get('ul>li').eq(1).click();
  }

  static editSearchLinkDisplayed() {
    cy.get('#editSearchLink').contains('Edit search');
  }

  static clickNewSearchLink() {
    cy.get('#newSearchLink').click();
  }

  static clickEditSearchLink() {
    cy.get('#editSearchLink').click();
  }
}

module.exports = PartnershipResultsPage;
