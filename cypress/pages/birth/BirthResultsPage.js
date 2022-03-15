'use strict';

const ResultsPage = require('../ResultsPage');
const expectedMultipleRec = require('../../fixtures/birth').multipleValidRecords;

class BirthResultsPage extends ResultsPage {

  static noRecordFound() {
    cy.get('h1').contains('No records found for Test InvalidRecord 01/01/2011');
  }

  static multipleRecordsFound(dob) {
    const child = expectedMultipleRec.child;
    const { surname, givenName } = expectedMultipleRec.child.name;
    const fatherName = expectedMultipleRec.father.name.fullName;
    const motherName = expectedMultipleRec.mother.name.fullName;
    const dateOfBirth = dob ? dob : expectedMultipleRec.child.dateOfBirth;

    ResultsPage.shouldBeVisible();

    // displays message that multiple records found
    cy.get('h1').contains(`3 records found for ${givenName} ${surname} ${dateOfBirth}`);

    // displays a subset of each record in a list
    cy.get('ul>li').each(() => {}).contains(`Place of birth ${child.birthplace}`);
    cy.get('ul>li').each(() => {}).contains(`Mother ${motherName}`);
    cy.get('ul>li').each(() => {}).contains(`Father ${fatherName}`);
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

module.exports = BirthResultsPage;
