'use strict';

const ResultsPage = require('../ResultsPage');
const expectedSingleRec = require('../../fixtures/birth').validRecord;
const expectedMultipleRec = require('../../fixtures/birth').multipleValidRecords;

class BirthResultsPage extends ResultsPage {

  static searchInvalidRecords() {
    cy.get('h1').contains('No records found for Test InvalidRecord 01/01/2011');
  }

  static searchValidRecords() {
    const child = expectedSingleRec.child;
    const name = child.name;

    ResultsPage.shouldBeVisible();
    cy.get('h1').contains(`${name.fullName} ${child.dateOfBirth}`);
  }

  static searchForMultipleValidRecords(dob) {
    const child = expectedMultipleRec.child;
    const name = child.name;
    const birthplace = expectedMultipleRec.child.birthplace;
    const fatherName = expectedMultipleRec.father.name.fullName;
    const motherName = expectedMultipleRec.mother.name.fullName;
    const dateOfBirth = dob ? dob : child.dateOfBirth

    ResultsPage.shouldBeVisible();

    // displays message that multiple records found
    cy.get('h1').contains(`3 records found for ${name.givenName} ${name.surname} ${dateOfBirth}`);

    // displays a subset of each record in a list
    cy.get('ul>li').each(() => {}).contains(`Place of birth ${birthplace}`);
    cy.get('ul>li').each(() => {}).contains(`Mother ${motherName}`);
    cy.get('ul>li').each(() => {}).contains(`Father ${fatherName}`);
  }

  static editSearchLink() {
    cy.get('a').contains('Edit search')
  }
}

module.exports = BirthResultsPage;
