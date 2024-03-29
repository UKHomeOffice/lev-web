'use strict';

const moment = require('moment');
const expectedNoRecords = require('../../../fixtures/partnership/expected-no-records');
const expectedSingleRecord = require('../../../fixtures/partnership/expected-partnership-record');
const expectedMultipleRecords = require('../../../fixtures/partnership/expected-partnership-records');
const PartnershipResultsPage = require('../../../pages/partnership/PartnershipResultsPage');
const PartnershipSearchPage = require('../../../pages/partnership/PartnershipSearchPage');
const LoginPage = require('../../../pages/LoginPage');
const DetailsPage = require('../../../pages/DetailsPage');
const ResultsPage = require('../../../pages/ResultsPage');
const conf = require('../../../../fields/partnership');
const since = conf.dop.validate[2].arguments[0];

describe('Partnership search', () => {
  before(() => {
    LoginPage.login();
  });

  it('returns the search page', () => {
    PartnershipSearchPage.visit();
    PartnershipSearchPage.shouldBeVisible();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      const { search } = expectedNoRecords;

      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
      });
      it('returns a results page', () => {
        PartnershipResultsPage.shouldBeVisible();
      });
      it('displays an appropriate message', () => {
        PartnershipResultsPage.noRecordFound(search);
      });
    });

    describe('that contains 1 record', () => {
      const { search } = expectedSingleRecord;
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
      });
      it('redirects to a details page', () => {
        DetailsPage.shouldBeVisible();
      });
    });
    describe('that returns more than 1 record', () => {
      const { search } = expectedMultipleRecords;

      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch(search);
      });
      it('returns a results page', () => {
        ResultsPage.shouldBeVisible();
      });
      it('displays an appropriate record summary message', () => {
        PartnershipResultsPage.multipleRecordsSummary(search);
      });
      it('displays a subset of each record', () => {
        // should this define order? Think about
        PartnershipResultsPage.multipleRecordsFound();
      });
      it('contains a link back to the search screen', () => {
        PartnershipResultsPage.editSearchLinkDisplayed();
      });
    });
    describe('using the "fast entry" date format', () => {
      describe('completes a search', () => {
        const dop = expectedMultipleRecords.search.dop.replace(/\//g, '');
        const search = { ...expectedMultipleRecords.search, dop };
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch(search);
        });
        it('returns a results page', () => {
          PartnershipResultsPage.shouldBeVisible();
          PartnershipResultsPage.multipleRecordsFound();
        });
        it('displays an appropriate message', () => {
          PartnershipResultsPage.multipleRecordsSummary(search);
        });
      });
    });
  });
  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch({ surname: '', forenames: '', dop: '' });
      });
      it('displays appropriate error messages', () => {
        PartnershipSearchPage.noSearchCriteria();
      });
    });
    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch({
            systemNumber: 'invalid', surname: '', forenames: '', dop: ''
          });
        });
        it('displays an error message, requests a number and shows hint image', () => {
          PartnershipSearchPage.noSystemNumber();
        });
      });
      describe('of an invalid length', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch({
            systemNumber: 12345678, surname: '', forenames: '', dop: ''
          });
        });
        it('displays an error message, requests a 9 digit number and shows hint image', () => {
          PartnershipSearchPage.invalidLengthSystemNumber();
        });
      });
    });
    describe('with a missing first name', () => {
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch({
          surname: 'Surname', forenames: '', dop: '5/6/2010'
        });
      });
      it('displays an error message, requests a forename and focuses on forename field', () => {
        PartnershipSearchPage.noForenames();
      });
    });
    describe('and a missing surname', () => {
      before(() => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.performSearch({
          surname: '', forenames: '', dop: '5/6/2010'
        });
      });
      it('displays an error message, requests a surname, forename and focuses on ' +
        'surname field (as that comes before forenames)', () => {
        PartnershipSearchPage.noSurname();
      });
    });
    describe('with an invalid date of Partner that is', () => {
      describe('not a date', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.shouldBeVisible();
          PartnershipSearchPage.performSearch({
            surname: 'TEST', forenames: 'TEST', dop: 'invalid'
          });
        });
        it('displays an error message, requests a valid dop and focuses on dop field', () => {
          PartnershipSearchPage.invalidDOP();
        });
      });
      describe('too short', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr', dop: '112001'
          });
        });
        it('displays an error message', () => {
          PartnershipSearchPage.invalidDOP();
        });
      });
      describe('a date in the future', () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr',
            dop: moment().add(1, 'day').format('DD/MM/YYYY')
          });
        });
        it('displays an error message, requests a past date and shows the dop hint', () => {
          PartnershipSearchPage.dopInFuture();
        });
      });
      describe(`a date before records began (${since.format('DD/MM/YYYY')})`, () => {
        before(() => {
          PartnershipSearchPage.visit();
          PartnershipSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr',
            dop: moment(since).add(-1, 'day').format('DD/MM/YYYY')
          });
        });
        it('displays an error message and shows dop hint', () => {
          PartnershipSearchPage.dopBeforeRecordsBegan();
        });
      });
    });
  });
});
