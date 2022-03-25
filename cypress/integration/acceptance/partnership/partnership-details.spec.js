'use strict';

const LoginPage = require('../../../pages/LoginPage');
const PartnershipSearchPage = require('../../../pages/partnership/PartnershipSearchPage');
const PartnershipDetailsPage = require('../../../pages/partnership/PartnershipDetailsPage');
const singleRecord = require('../../../fixtures/partnership/expected-partnership-record');

describe('Partnership details', () => {
  before(() => {
    LoginPage.login();
  });
  describe('single record found', () => {
    describe('where there is one result', () => {
      const { search, result } = singleRecord;
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
      });
      it('single record summary should be displayed', () => {
        PartnershipDetailsPage.recordSummaryDisplayed(result);
      });
      it('single record summary should be displayed', () => {
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
      describe('When I select the "New search" button', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch(search);
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
      if (!Cypress.env('e2e')) {
        describe('which shows the full details to select users', () => {
          before(() => {
            PartnershipDetailsPage.searchWithFullDetailsRole(singleRecord.search, singleRecord.result, false);
          });
          it('returns a details page', () => {
            PartnershipDetailsPage.shouldBeVisible();
          });
          it('an appropriate message is displayed', () => {
            PartnershipDetailsPage.recordSummaryDisplayed(singleRecord.result);
          });
          it('the complete record is displayed in a table', () => {
            PartnershipDetailsPage.showsPartner1Details(singleRecord.result);
            PartnershipDetailsPage.showsPartner2Details(singleRecord.result);
            PartnershipDetailsPage.showsPartner1ParentDetails(singleRecord.result);
            PartnershipDetailsPage.showsPartner2ParentDetails(singleRecord.result);
          });
          it('contains a edit search button', () => {
            PartnershipDetailsPage.editSearchLinkVisible();
          });
          it('does not contain a link back to the search results screen', () => {
            PartnershipDetailsPage.backToSearchResultsNotDisplayed();
          });
        });
      }
    });
  });

