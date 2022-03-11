'use strict';

const LoginPage = require('../../pages/LoginPage');
const BirthSearchPage = require('../../pages/birth/BirthSearchPage');
const BirthDetailsPage = require('../../pages/birth/BirthDetailsPage');
const BirthResultsPage = require('../../pages/birth/BirthResultsPage');
const { multipleValidRecords, validRecord } = require('../../fixtures/birth');

describe.only('Birth details', () => {
  before(() => {
    LoginPage.login();
  });
  describe('single record found', () => {
    const child = validRecord.child;
    const name = child.name;
    it('back to search results link not displayed', () => {
      BirthDetailsPage.backToSearchResultsNotDisplayed();
    });
    describe('When I select the "New search" button', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname, forenames: name.givenName,
          dob: child.dateOfBirth
        });
        BirthDetailsPage.clickNewSearchLink();
      });
      it('shows the search page', () => {
        BirthSearchPage.shouldBeVisible();
      });
      it('new search has empty values', () => {
        BirthSearchPage.searchFormClear();
      });
    });
    describe('When I select the "Edit search" button', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname,
          forenames: name.givenName, dob: child.dateOfBirth
        });
        BirthDetailsPage.clickEditSearchLink();
      });
      it('shows the search page', () => {
        BirthSearchPage.shouldBeVisible();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormRetainedValues(child);
      });
    });
  });
  describe('multiple records found', () => {
    const child = multipleValidRecords.child;
    const name = child.name;
    before(() => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch({
        surname: name.surname, forenames: name.givenName,
        dob: child.dateOfBirth
      });
    });
    it('back to search results link not displayed', () => {
      BirthDetailsPage.backToSearchResultsNotDisplayed();
    });
    describe('When I select the "Back to search results link on the details page"', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname, forenames: name.givenName,
          dob: child.dateOfBirth
        });
      });
      it('returned me to the results page', () => {
        BirthResultsPage.selectFirstRecord();
        BirthDetailsPage.clickBackToResultsLink();
        BirthResultsPage.multipleRecordsFound();
      });
    });
  });
});


