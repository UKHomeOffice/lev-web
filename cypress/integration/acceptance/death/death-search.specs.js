'use strict';

const moment = require('moment');
const expectedNoRecords = require('../../../fixtures/death/expected-no-records');
const expectedSingleRecord = require('../../../fixtures/death/expected-death-record');
const expectedMultipleRecords = require('../../../fixtures/death/expected-death-records');
const DeathDetailsPage = require('../../../pages/death/DeathDetailsPage');
const DeathResultsPage = require('../../../pages/death/DeathResultsPage');
const DeathSearchPage = require('../../../pages/death/DeathSearchPage');
const LoginPage = require('../../../pages/LoginPage');

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
      const { search, results } = expectedMultipleRecords;

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
        DeathResultsPage.hasExpectedResults(results);
      });

      it('contains a link back to the search screen', () => {
        DeathResultsPage.hasNewSearchButton();
        DeathResultsPage.hasEditSearchButton();
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
        DeathSearchPage.hasErrorTitle();
      });

      it('requests a surname', () => {
        DeathSearchPage.hasErrorMessage('Please enter a surname');
      });

      it('requests a forename', () => {
        DeathSearchPage.hasErrorMessage('Please enter at least one forename');
      });

      it('requests a date of birth or death', () => {
        DeathSearchPage.hasErrorMessage('Please enter a date');
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
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a system number', () => {
          DeathSearchPage.hasErrorMessage('Please enter a number');
        });

        it('shows the system number details hint', () => {
          DeathSearchPage.hasSystemNumberHint();
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
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a system number of the valid length', () => {
          DeathSearchPage.hasErrorMessage('The system number should be 9 digits');
        });

        it('shows the system number details hint', () => {
          DeathSearchPage.hasSystemNumberHint();
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
        DeathSearchPage.hasErrorTitle();
      });

      it('requests a forename', () => {
        DeathSearchPage.hasErrorMessage('Please enter at least one forename');
      });

      it('the forenames field should be focused', () => {
        DeathSearchPage.hasForenamesFocused();
      });

      describe('and a missing surname', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            dobd: '5/6/2010'
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a surname', () => {
          DeathSearchPage.hasErrorMessage('Please enter a surname');
        });

        it('requests a forename', () => {
          DeathSearchPage.hasErrorMessage('Please enter at least one forename');
        });

        it('the surname field should be focused (as that comes before forenames)', () => {
          DeathSearchPage.hasSurnameFocused();
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
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a British formatted date', () => {
          DeathSearchPage.hasErrorMessage('Please enter a date in the correct format');
        });

        it('shows the date of birth/death details hint', () => {
          DeathSearchPage.hasDateOfBirthOrDeathHint();
        });

        it('the date of birth/death field should be focused', () => {
          DeathSearchPage.hasDateOfBirthOrDeathFocused();
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
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a past date', () => {
          DeathSearchPage.hasErrorMessage('Please enter a date in the past');
        });

        it('shows the date of birth/death details hint', () => {
          DeathSearchPage.hasDateOfBirthOrDeathHint();
        });
      });
    });

    describe('with an invalid short date that is', () => {
      describe('too short', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dobd: '112001'
          });
        });

        it('displays the error message', () => {
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a British formatted date', () => {
          DeathSearchPage.hasErrorMessage('Please enter a date in the correct format');
        });

        it('shows the date of birth/death details hint', () => {
          DeathSearchPage.hasDateOfBirthOrDeathHint();
        });

        it('the date of birth/death field should be focused', () => {
          DeathSearchPage.hasDateOfBirthOrDeathFocused();
        });
      });

      describe('a date in the future', () => {
        before(() => {
          DeathSearchPage.visit();
          DeathSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dobd: moment().add(1, 'day').format('DDMMYYYY')
          });
        });

        it('displays an error message', () => {
          DeathSearchPage.hasErrorTitle();
        });

        it('requests a past date', () => {
          DeathSearchPage.hasErrorMessage('Please enter a date in the past');
        });

        it('shows the date of birth/death details hint', () => {
          DeathSearchPage.hasDateOfBirthOrDeathHint();
        });
      });
    });
  });
});
