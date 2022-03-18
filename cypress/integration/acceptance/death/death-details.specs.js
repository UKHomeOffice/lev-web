'use strict';

const expectedSingleRecord = require('../../../fixtures/death/expected-death-record');
const expectedMultipleRecords = require('../../../fixtures/death/expected-death-records');
const LoginPage = require('../../../pages/LoginPage');
const DeathDetailsPage = require('../../../pages/death/DeathDetailsPage');
const DeathResultsPage = require('../../../pages/death/DeathResultsPage');
const DeathSearchPage = require('../../../pages/death/DeathSearchPage');

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
      DeathDetailsPage.hasLimitedRecord(result);
    });

    it('contains a link back to the search screen', () => {
      DeathDetailsPage.hasEditSearchButton();
    });

    it('does not contain a link back to the search results screen', () => {
      DeathDetailsPage.backToSearchResultsNotDisplayed();
    });

    if (!Cypress.env('e2e')) {
      describe('which shows the full details to select users', () => {
        before(() => {
          DeathDetailsPage.visitWithFullDetails(search, result);
        });

        it('returns a details page', () => {
          DeathDetailsPage.shouldBeVisible();
        });

        it('an appropriate message is displayed', () => {
          DeathDetailsPage.hasExpectedTitle(result);
        });

        it('the complete record is displayed in a table', () => {
          DeathDetailsPage.hasCompleteRecord(result);
        });

        it('contains a link back to the search screen', () => {
          DeathDetailsPage.hasEditSearchButton();
        });

        it('does not contain a link back to the search results screen', () => {
          DeathDetailsPage.backToSearchResultsNotDisplayed();
        });
      });
    }
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
      DeathDetailsPage.hasLimitedRecord(result);
    });

    it('contains a link back to the search screen', () => {
      DeathDetailsPage.hasEditSearchButton();
    });

    it('contains a link back to the search results screen', () => {
      DeathDetailsPage.backToSearchResultsDisplayed();
    });

    if (!Cypress.env('e2e')) {
      describe('which shows the full details to select users', () => {
        before(() => {
          DeathDetailsPage.visitWithFullDetails(search, result, true);
        });

        it('returns a details page', () => {
          DeathDetailsPage.shouldBeVisible();
        });

        it('an appropriate message is displayed', () => {
          DeathDetailsPage.hasExpectedTitle(result);
        });

        it('the complete record is displayed in a table', () => {
          DeathDetailsPage.hasCompleteRecord(result);
        });

        it('contains a link back to the search screen', () => {
          DeathDetailsPage.hasEditSearchButton();
        });

        it('contains a link back to the search results screen', () => {
          DeathDetailsPage.backToSearchResultsDisplayed();
        });
      });
    }
  });

  describe('When I select the "New search" button', () => {
    const { search } = expectedSingleRecord;

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
      DeathDetailsPage.shouldBeVisible();
      DeathDetailsPage.clickNewSearchButton();
    });

    it('returns me to the search page', () => {
      DeathSearchPage.shouldBeVisible();
    });

    it('has empty form values', () => {
      DeathSearchPage.hasExpectedValues({
        systemNumber: '',
        surname: '',
        forenames: '',
        dobd: ''
      });
    });
  });

  describe('When I select the "Edit search" link on the results page', () => {
    const search = {
      systemNumber: '',
      surname: 'NotRealPersonSurname',
      forenames: 'NotRealPersonForename',
      dobd: '01/01/2010'
    };

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
      DeathResultsPage.shouldBeVisible();
      DeathResultsPage.clickEditSearchButton();
    });

    it('returns me to the search page', () => {
      DeathSearchPage.shouldBeVisible();
    });

    it('has the correct form values', () => {
      DeathSearchPage.hasExpectedValues(search);
    });
  });

  describe('When I select the "Edit search" link on the details page', () => {
    const { search } = expectedSingleRecord;

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
      DeathDetailsPage.shouldBeVisible();
      DeathDetailsPage.clickEditSearchButton();
    });

    it('returns me to the search page', () => {
      DeathSearchPage.shouldBeVisible();
    });

    it('has the correct form values', () => {
      DeathSearchPage.hasExpectedValues(search);
    });
  });

  describe('When I select the "Back to search results link on the details page"', () => {
    const { search, results } = expectedMultipleRecords;

    before(() => {
      DeathSearchPage.visit();
      DeathSearchPage.performSearch(search);
      DeathResultsPage.shouldBeVisible();
      DeathResultsPage.clickFirstRecord();
      DeathDetailsPage.shouldBeVisible();
      DeathDetailsPage.clickBackToResultsButton();
    });

    it('returns me to the results page', () => {
      DeathResultsPage.shouldBeVisible();
    });

    it('has the correct rows', () => {
      DeathResultsPage.hasExpectedTitle(expectedMultipleRecords);
      DeathResultsPage.hasExpectedResults(results);
    });
  });
});
