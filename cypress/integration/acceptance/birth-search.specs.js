'use strict';

const LoginPage = require('../../pages/LoginPage');
const BirthSearchPage = require('../../pages/birth/BirthSearchPage');
const moment = require('moment');
const conf = require('../../../fields');
const { validRecord } = require('../../fixtures/birth');
const BirthDetailsPage = require('../../pages/birth/BirthDetailsPage');
const since = conf.dob.validate[2].arguments[0];

describe.only('Birth search', () => {
  before(() => {
    LoginPage.login();
  });
  describe('submitting a valid query', () => {
    describe('where there is one result', () => {
      const child = validRecord.child;
      const name = child.name;

      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
        });
      });
      it('single record should be displayed', () => {
        BirthDetailsPage.recordSummaryDisplayed(validRecord);
        BirthDetailsPage.recordDisplayed(validRecord);
      });
      describe('When I select the "New search" button', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
          });
          BirthDetailsPage.clickNewSearchLink();

          it('shows the search page', () => {
            BirthSearchPage.shouldBeVisible();
          });
        });
        it('new search has empty values', () => {
          BirthSearchPage.searchFormClear();
        });
      });
      describe('When I select the "Edit search" button', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            surname: name.surname, forenames: name.givenName, dob: child.dateOfBirth
          });
          BirthDetailsPage.clickEditSearchLink();
        });
        it('shows the search page', () => {
          BirthSearchPage.shouldBeVisible();
        });
        it('has the correct form values', () => {
          BirthSearchPage.searchFormRetainedValues(child);
        });
      });
    });
    describe('submitting an invalid query', () => {
      describe('with all fields empty', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({ surname: '', forenames: '', dob: '' });
        });
        it('displays appropriate error messages', () => {
          BirthSearchPage.noSearchCriteria();
        });
      });
    });
    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            systemNumber: 'invalid', surname: '', forenames: '', dob: ''
          });
        });
        it('displays an error message, requests a number and shows hint image', () => {
          BirthSearchPage.noSystemNumber();
        });
      });
      describe('of an invalid length', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            systemNumber: 12345678, surname: '', forenames: '', dob: ''
          });
        });

        it('displays an error message, requests a 9 digit number and shows hint image', () => {
          BirthSearchPage.invalidLengthSystemNumber();
        });
      });
    });
    describe('with a missing first name', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: 'Surname', forenames: '', dob: '5/6/2010'
        });
      });
      it('displays an error message, requests a forename and focuses on forename field', () => {
        BirthSearchPage.noForenames();
      });
    });
    describe('and a missing surname', () => {
      before(() => {
        BirthSearchPage.visit();
        BirthSearchPage.performSearch({
          surname: '', forenames: '', dob: '5/6/2010'
        });
      });
      it('displays an error message, requests a surname, forename and focuses on ' +
        'surname field (as that comes before forenames)', () => {
        BirthSearchPage.noSurname();
      });
    });
    describe('with an invalid date of birth that is', () => {
      describe('not a date', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.shouldBeVisible();
          BirthSearchPage.performSearch({
            surname: 'TEST', forenames: 'TEST', dob: 'invalid'
          });
        });
        it('displays an error message, requests a valid dob and focuses on dob field', () => {
          BirthSearchPage.invalidDOB();
        });
      });
      describe('too short', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr', dob: '112001'
          });
        });
        it('displays an error message', () => {
          BirthSearchPage.invalidDOB();
        });
      });
      describe('a date in the future', () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr',
            dob: moment().add(1, 'day').format('DD/MM/YYYY')
          });
        });
        it('displays an error message, requests a past date and shows the dob hint', () => {
          BirthSearchPage.dobInFuture();
        });
      });
      describe(`a date before records began (${since.format('DD/MM/YYYY')})`, () => {
        before(() => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch({
            surname: 'McFly', forenames: 'Marty Jr',
            dob: moment(since).add(-1, 'day').format('DD/MM/YYYY')
          });
        });
        it('displays an error message and shows dob hint', () => {
          BirthSearchPage.dobBeforeRecordsBegan();
        });
      });
    });
  });
});
