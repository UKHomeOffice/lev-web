'use strict';

const moment = require('moment');
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
        DeathResultsPage.hasExpectedTitle(expectedNoRecords);
      });
    });

    describe('that returns 1 record', () => {
      const { search, result } = expectedSingleRecord;

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(search);
      });

      it('redirects to a details page', () => {
        DeathDetailsPage.shouldBeVisible();
        DeathDetailsPage.hasExpectedTitle(result);
      });
    });

    describe('that returns more than 1 record', () => {
      const { search } = expectedMultipleRecords;

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(search);
      });

      it('returns a results page', () => {
        DeathResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        DeathResultsPage.hasExpectedTitle(expectedMultipleRecords);
      });

      it('displays a subset of each record in a list', () => {
        DeathResultsPage.hasExpectedRows(expectedMultipleRecords);
      });

      it('contains a link back to the search screen', () => {
        DeathResultsPage.hasNewSearchLink();
        DeathResultsPage.hasEditSearchLink();
      });
    });

    describe('using the "fast entry" date format', () => {
      const expected = {
        ...expectedMultipleRecords,
        search: {
          ...expectedMultipleRecords.search,
          dobd: expectedMultipleRecords.search.dobd.replace(/\//g, '')
        }
      };

      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch(expected.search);
      });

      it('returns a results page', () => {
        DeathResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        DeathResultsPage.hasExpectedTitle(expected);
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch({});
      });

      it('displays an error message', () => {
        DeathSearchPage.hasNoSearchCriteria();
      });
    });

    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            systemNumber: 'invalid'
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasInvalidSystemNumber('Please enter a number');
        });
      });

      describe('of an invalid length', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            systemNumber: '12345678'
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasInvalidSystemNumber('The system number should be 9 digits');
        });
      });
    });

    describe('with a missing first name', () => {
      before(() => {
        DeathSearchPage.visit();
        DeathSearchPage.performSearch({
          surname: 'Surname',
          dobd: '5/6/2010'
        });
      });

      it('displays an error message', () => {
        DeathSearchPage.hasMissingForenames();
      });

      describe('and a missing surname', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            dobd: '5/6/2010'
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasMissingForenamesAndSurname();
        });
      });
    });

    describe('with an invalid date that is', () => {
      describe('not a date', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dobd: 'invalid'
          });
        });

        it('displays the error message', () => {
          DeathSearchPage.hasInvalidDate();
        });
      });

      describe('a date in the future', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dobd: moment().add(1, 'day').format('DD/MM/YYYY')
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasDateInFuture();
        });
      });
    });
  });
});
