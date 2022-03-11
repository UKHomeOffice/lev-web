'use strict';

const expectedNoRecords = require('../../fixtures/death/expected-no-records');
const expectedSingleRecord = require('../../fixtures/death/expected-death-record');
const expectedMultipleRecords = require('../../fixtures/death/expected-death-records');
const DeathDetailsPage = require('../../pages/death/DeathDetailsPage');
const DeathResultsPage = require('../../pages/death/DeathResultsPage');
const DeathSearchPage = require('../../pages/death/DeathSearchPage');
const LoginPage = require('../../pages/LoginPage');

describe('Death search', () => {
  before(() => {
    LoginPage.login();
  });

  it('returns the search page', () => {
    DeathSearchPage.visit();
    DeathSearchPage.shouldBeVisible();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      const { search } = expectedNoRecords;

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(search);
      });

      it('returns a results page', () => {
        DeathResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        DeathResultsPage.hasTitle(`No records found for ${search.forenames} ${search.surname} ${search.dobd}`);
      });
    });

    describe('that returns 1 record', () => {
      const { search, result } = expectedSingleRecord;
      const { deceased } = result;

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(search);
      });

      it('redirects to a details page', () => {
        DeathDetailsPage.shouldBeVisible();
        DeathDetailsPage.hasTitle(`${deceased.forenames} ${deceased.surname} ${deceased.dateOfBirth}`);
      });
    });

    describe('that returns more than 1 record', () => {
      const {search} = expectedMultipleRecords;

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(search);
      });

      it('returns a results page', () => {
        DeathResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        DeathResultsPage.hasTitle(`3 records found for ${search.forenames} ${search.surname} ${search.dobd}`);
      });

      it('displays a subset of each record in a list', () => {
        DeathResultsPage.hasExpectedResult(expectedMultipleRecords.result);
      });

      it('contains a link back to the search screen', () => {
        DeathResultsPage.hasNewSearchLink();
        DeathResultsPage.hasEditSearchLink();
      });
    });
  });
});
