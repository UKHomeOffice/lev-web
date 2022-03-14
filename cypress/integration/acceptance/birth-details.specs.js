'use strict';

const LoginPage = require('../../pages/LoginPage');
const BirthSearchPage = require('../../pages/birth/BirthSearchPage');
const BirthDetailsPage = require('../../pages/birth/BirthDetailsPage');
const BirthResultsPage = require('../../pages/birth/BirthResultsPage');
const { searchSingleRecord, searchMultipleRecords } = require('../../fixtures/birth');

describe.only('Birth details', () => {
  before(() => {
    LoginPage.login();
  });
  describe('single record found', () => {
    it('back to search results link not displayed', () => {
      BirthDetailsPage.backToSearchResultsNotDisplayed();
    });
    describe('When I select the "New search" button', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch(searchSingleRecord);
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
        BirthSearchPage.performSearch(searchSingleRecord);
        BirthDetailsPage.clickEditSearchLink();
      });
      it('shows the search page', () => {
        BirthSearchPage.shouldBeVisible();
      });
      it('has the correct form values', () => {
        BirthSearchPage.searchFormRetainedValues(searchSingleRecord);
      });
    });
  });
  describe('multiple records found', () => {
    before(() => {
      BirthSearchPage.visit();
      BirthSearchPage.performSearch(searchMultipleRecords);
    });
    it('back to search results link not displayed', () => {
      BirthDetailsPage.backToSearchResultsNotDisplayed();
    });
    describe('When I select the "Back to search results link on the details page"', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch(searchMultipleRecords);
      });
      it('returned me to the results page', () => {
        BirthResultsPage.selectFirstRecord();
        BirthDetailsPage.clickBackToResultsLink();
        BirthResultsPage.multipleRecordsFound();
      });
    });
  });
});


