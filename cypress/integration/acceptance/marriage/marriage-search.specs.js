'use strict';

const moment = require('moment');
const expectedNoRecords = require('../../../fixtures/marriage/expected-no-records');
const expectedSingleRecord = require('../../../fixtures/marriage/expected-marriage-record');
const expectedMultipleRecords = require('../../../fixtures/marriage/expected-marriage-records');
const MarriageDetailsPage = require('../../../pages/marriage/MarriageDetailsPage');
const MarriageResultsPage = require('../../../pages/marriage/MarriageResultsPage');
const MarriageSearchPage = require('../../../pages/marriage/MarriageSearchPage');
const LoginPage = require('../../../pages/LoginPage');

describe('Marriage search', () => {
  before(() => {
    LoginPage.login();
  });

  it('returns the search page', () => {
    MarriageSearchPage.visit();
    MarriageSearchPage.shouldBeVisible();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      const { search } = expectedNoRecords;

      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch(search);
      });

      it('returns a results page', () => {
        MarriageResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        MarriageResultsPage.hasExpectedTitle(expectedNoRecords);
      });
    });

    describe('that returns 1 record', () => {
      const { search, result } = expectedSingleRecord;

      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch(search);
      });

      it('redirects to a details page', () => {
        MarriageDetailsPage.shouldBeVisible();
        MarriageDetailsPage.hasExpectedTitle(result);
      });
    });

    describe('that returns more than 1 record', () => {
      const { search } = expectedMultipleRecords;

      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch(search);
      });

      it('returns a results page', () => {
        MarriageResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        MarriageResultsPage.hasExpectedTitle(expectedMultipleRecords);
      });

      it('displays a subset of each record in a list', () => {
        MarriageResultsPage.hasExpectedRows(expectedMultipleRecords);
      });

      it('contains a link back to the search screen', () => {
        MarriageResultsPage.hasNewSearchButton();
        MarriageResultsPage.hasEditSearchButton();
      });
    });

    describe('using the "fast entry" date format', () => {
      const expected = {
        ...expectedMultipleRecords,
        search: {
          ...expectedMultipleRecords.search,
          dom: expectedMultipleRecords.search.dom.replace(/\//g, '')
        }
      };

      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch(expected.search);
      });

      it('returns a results page', () => {
        MarriageResultsPage.shouldBeVisible();
      });

      it('displays an appropriate message', () => {
        MarriageResultsPage.hasExpectedTitle(expected);
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch({});
      });

      it('displays an error message', () => {
        MarriageSearchPage.hasErrorTitle();
      });

      it('requests a surname', () => {
        MarriageSearchPage.hasErrorMessage('Please enter a surname');
      });

      it('requests a forename', () => {
        MarriageSearchPage.hasErrorMessage('Please enter at least one forename');
      });

      it('requests a date of marriage', () => {
        MarriageSearchPage.hasErrorMessage('Please enter a date of marriage');
      });
    });

    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            systemNumber: 'invalid'
          });
        });

        it('displays an error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a system number', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a number');
        });

        it('shows the system number details hint', () => {
          MarriageSearchPage.hasSystemNumberHint();
        });
      });

      describe('of an invalid length', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            systemNumber: '12345678'
          });
        });

        it('displays an error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a system number of the valid length', () => {
          MarriageSearchPage.hasErrorMessage('The system number should be 9 digits');
        });

        it('shows the system number details hint', () => {
          MarriageSearchPage.hasSystemNumberHint();
        });
      });
    });

    describe('with a missing first name', () => {
      before(() => {
        MarriageSearchPage.visit();
        MarriageSearchPage.performSearch({
          surname: 'Surname',
          dom: '5/6/2010'
        });
      });

      it('displays an error message', () => {
        MarriageSearchPage.hasErrorTitle();
      });

      it('requests a forename', () => {
        MarriageSearchPage.hasErrorMessage('Please enter at least one forename');
      });

      it('the forenames field should be focused', () => {
        MarriageSearchPage.hasForenamesFocused();
      });

      describe('and a missing surname', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            dom: '5/6/2010'
          });
        });

        it('displays an error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a surname', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a surname');
        });

        it('requests a forename', () => {
          MarriageSearchPage.hasErrorMessage('Please enter at least one forename');
        });

        it('the surname field should be focused (as that comes before forenames)', () => {
          MarriageSearchPage.hasSurnameFocused();
        });
      });
    });

    describe('with an invalid date that is', () => {
      describe('not a date', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dom: 'invalid'
          });
        });

        it('displays the error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a British formatted date', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a date of marriage in the correct format');
        });

        it('shows the date of marriage details hint', () => {
          MarriageSearchPage.hasDateOfMarriageHint();
        });

        it('the date of marriage field should be focused', () => {
          MarriageSearchPage.hasDateOfMarriageFocused();
        });
      });

      describe('a date in the future', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dom: moment().add(1, 'day').format('DD/MM/YYYY')
          });
        });

        it('displays an error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a past date', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a date of marriage in the past');
        });

        it('shows the date of marriage details hint', () => {
          MarriageSearchPage.hasDateOfMarriageHint();
        });
      });
    });

    describe('with an invalid short date that is', () => {
      describe('too short', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dom: '112001'
          });
        });

        it('displays the error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a British formatted date', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a date of marriage in the correct format');
        });

        it('shows the date of marriage details hint', () => {
          MarriageSearchPage.hasDateOfMarriageHint();
        });

        it('the date of marriage field should be focused', () => {
          MarriageSearchPage.hasDateOfMarriageFocused();
        });
      });

      describe('a date in the future', () => {
        before(() => {
          MarriageSearchPage.visit();
          MarriageSearchPage.performSearch({
            surname: 'Churchill',
            forenames: 'Winston',
            dom: moment().add(1, 'day').format('DDMMYYYY')
          });
        });

        it('displays an error message', () => {
          MarriageSearchPage.hasErrorTitle();
        });

        it('requests a past date', () => {
          MarriageSearchPage.hasErrorMessage('Please enter a date of marriage in the past');
        });

        it('shows the date of marriage details hint', () => {
          MarriageSearchPage.hasDateOfMarriageHint();
        });
      });
    });
  });
});
