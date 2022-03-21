'use strict';

const LoginPage = require('../../pages/LoginPage');
const PartnershipSearchPage = require('../../pages/partnership/PartnershipSearchPage');
const PartnershipResultsPage = require('../../pages/partnership/PartnershipResultsPage');
const PartnershipDetailsPage = require('../../pages/partnership/PartnershipDetailsPage');
const expectedMultipleRecords = require('../../fixtures/partnership/expected-partnership-records');
const ResultsPage = require('../../pages/ResultsPage');

describe('Partnership results', () => {
  before(() => {
    LoginPage.login();
  });
  describe('multiple records found', () => {
    const { search, result } = expectedMultipleRecords;

    before(() => {
      PartnershipSearchPage.visit();
      PartnershipSearchPage.performSearch(search);
    });
    it('returns a results page', () => {
      ResultsPage.shouldBeVisible();
    });
    it('multiple record summary displayed', () => {
      PartnershipResultsPage.multipleRecordsSummary(search);
    });
    it('click on first record and record displayed', () => {
      PartnershipResultsPage.selectFirstRecord();
    });
    it('multiple record summary should be displayed', () => {
      PartnershipDetailsPage.recordDisplaysSystemNumber(result);
    });
    it('partnership details should be displayed', () => {
      PartnershipDetailsPage.recordDisplaysPartnershipDetails(result);
    });
    it('partner personal details should be displayed', () => {
      PartnershipDetailsPage.recordDisplaysPersonalDetails(result);
    });
    it('should not show full record', () => {
      PartnershipDetailsPage.recordDoesNotDisplayFullRegistration(result);
      PartnershipDetailsPage.recordDoesNotDisplayFullPartner1Details(result);
      PartnershipDetailsPage.recordDoesNotDisplayFullPartner2Details(result);
    });
    it('returns me to the results page if I select the back to results link', () => {
      PartnershipDetailsPage.clickBackToResultsLink();
      PartnershipResultsPage.multipleRecordsFound();
    });
    describe('When I select the "New search" button', () => {
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
        PartnershipResultsPage.selectFirstRecord();
        PartnershipDetailsPage.clickNewSearchLink();
      });
      it('shows the search page', () => {
        PartnershipSearchPage.shouldBeVisible();
      });
      it('new search has empty values', () => {
        PartnershipSearchPage.searchFormClear();
      });
    });
    describe('When I select the "Edit search" button', () => {
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
        PartnershipResultsPage.selectFirstRecord();
        PartnershipDetailsPage.clickEditSearchLink();
      });
      it('shows the search page', () => {
        PartnershipSearchPage.shouldBeVisible();
      });
      it('has the correct form values', () => {
        PartnershipSearchPage.searchFormRetainedValues(search);
      });
    });
  });
});


