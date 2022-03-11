'use strict';

const LoginPage = require('../../pages/LoginPage');
const BirthSearchPage = require('../../pages/birth/BirthSearchPage');
const BirthResultsPage = require('../../pages/birth/BirthResultsPage');
const { multipleValidRecords } = require('../../fixtures/birth');
const BirthDetailsPage = require('../../pages/birth/BirthDetailsPage');

describe.only('Birth results', () => {
  const child = multipleValidRecords.child;
  const name = child.name;
  before(() => {
    LoginPage.login();
  });
  describe('that returns no records', () => {
    it('a record not found message should be displayed', () => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch({ surname: 'InvalidRecord',
        forenames: 'Test ', dob: '01/01/2011' });
      BirthResultsPage.noRecordFound();
    });
  });
  describe('that returns multiple records', () => {
    it('displays message that multiple records found', () => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch({
        surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
      });
      BirthResultsPage.multipleRecordsFound();
    });
    it('single record should be displayed after selection', () => {
      BirthResultsPage.multipleRecordsFound();
      BirthResultsPage.selectFirstRecord();
      BirthDetailsPage.recordSummaryDisplayed(multipleValidRecords);
      BirthDetailsPage.recordDisplayed(multipleValidRecords);
      BirthDetailsPage.backToSearchResultsDisplayed();
    });
    describe('using the "fast entry" date format', () => {
      it('completes a search', () => {
        const dob = multipleValidRecords.child.dateOfBirth.replace(/\//g, '');
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname, forenames: name.givenName, dob: dob
        });
        BirthResultsPage.multipleRecordsFound(dob);
      });
    });
    it('displays message that multiple records found', () => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch({
        surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
      });
      BirthResultsPage.editSearchLinkDisplayed();
    });
    describe('When I select the "Edit search" link on the results page', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
        });
        BirthResultsPage.clickEditSearchLink();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormRetainedValues(child);
      });
    });
    describe('When I select the "New search" link on the results page', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: multipleValidRecords.child.name.surname,
          forenames: multipleValidRecords.child.name.givenName, dob: multipleValidRecords.child.dateOfBirth
        });
        BirthResultsPage.clickNewSearchLink();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormClear();
      });
    });
  });
});
