'use strict';

const LoginPage = require('../../../pages/LoginPage');
const BirthSearchPage = require('../../../pages/birth/BirthSearchPage');
const BirthResultsPage = require('../../../pages/birth/BirthResultsPage');
const { multipleValidRecords, searchMultipleRecords } = require('../../../fixtures/birth');
const BirthDetailsPage = require('../../../pages/birth/BirthDetailsPage');

describe('Birth results', () => {
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
    before(() => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch(searchMultipleRecords);
      BirthResultsPage.multipleRecordsFound();
      BirthResultsPage.selectFirstRecord();
    });
    it('single record summary should be displayed', () => {
      BirthDetailsPage.recordSummaryDisplayed(multipleValidRecords);
    });
    it('system number should be displayed', () => {
      BirthDetailsPage.recordDisplaysSystemNumber(multipleValidRecords);
    });
    it('child details should be displayed', () => {
      BirthDetailsPage.recordDisplaysChildDetails(multipleValidRecords);
    });
    it('mother details should be displayed', () => {
      BirthDetailsPage.recordDisplaysMotherDetails(multipleValidRecords);
    });
    it('father details should be displayed', () => {
      BirthDetailsPage.recordDisplaysFatherDetails(multipleValidRecords);
    });
    it('birth registration details should be displayed', () => {
      BirthDetailsPage.recordDisplaysRegistrationDetails(multipleValidRecords);
    });
    describe('using the "fast entry" date format', () => {
      it('completes a search', () => {
        const dob = multipleValidRecords.child.dateOfBirth.replace(/\//g, '');
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          ...searchMultipleRecords, dob: dob
        });
        BirthResultsPage.multipleRecordsFound(dob);
      });
    });
    it('displays message that multiple records found', () => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch(searchMultipleRecords);
      BirthResultsPage.editSearchLinkDisplayed();
    });
    describe('When I select the "Edit search" link on the results page', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch(searchMultipleRecords);
        BirthResultsPage.clickEditSearchLink();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormRetainedValues(searchMultipleRecords);
      });
    });
    describe('When I select the "New search" link on the results page', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch(searchMultipleRecords);
        BirthResultsPage.clickNewSearchLink();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormClear();
      });
    });
  });
});
