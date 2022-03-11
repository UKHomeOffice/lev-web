'use strict';

const expectedSingleRecord = require('../../fixtures/death/expected-death-record');
const expectedMultipleRecords = require('../../fixtures/death/expected-death-records');
const LoginPage = require('../../pages/LoginPage');
const DeathDetailsPage = require('../../pages/death/DeathDetailsPage');
const DeathResultsPage = require('../../pages/death/DeathResultsPage');
const DeathSearchPage = require('../../pages/death/DeathSearchPage');

describe('Death details page', () => {
  before(() => {
    LoginPage.login();
  });

  describe('When there is one result', () => {
    const { search, result } = expectedSingleRecord;

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
    });

    it('returns a details page', () => {
      DeathDetailsPage.shouldBeVisible();
    });

    it('an appropriate message is displayed', () => {
      DeathDetailsPage.hasExpectedTitle(result);
    });

    it('a limited version is displayed in a table', () => {
      DeathDetailsPage.hasExpectedRecord(result);
    });

    it('contains a link back to the search screen', () => {
      DeathDetailsPage.hasEditSearchLink();
    });

    it('does not contain a link back to the search results screen', () => {
      DeathDetailsPage.backToSearchResultsNotDisplayed();
    });
  });

  describe('When there is more than one result', () => {
    const { search, results } = expectedMultipleRecords;
    const result = results[0];

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
      DeathResultsPage.shouldBeVisible();
      DeathResultsPage.clickFirstRecord();
    });

    it('returns a details page', () => {
      DeathDetailsPage.shouldBeVisible();
    });

    it('an appropriate message is displayed', () => {
      DeathDetailsPage.hasExpectedTitle(result);
    });

    it('a limited version is displayed in a table', () => {
      DeathDetailsPage.hasExpectedRecord(result);
    });

    it('contains a link back to the search screen', () => {
      DeathDetailsPage.hasEditSearchLink();
    });

    it('does not contain a link back to the search results screen', () => {
      DeathDetailsPage.backToSearchResultsDisplayed();
    });
  });
});
