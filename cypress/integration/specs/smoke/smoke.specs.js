'use strict';

const BirthSearchPage = require('../../../pages/BirthSearchPage');
const BirthResultsPage = require('../../../pages/BirthResultsPage');
const ErrorPage = require('../../../pages/ErrorPage');
const LoginPage = require('../../../pages/LoginPage');

describe('Accessing the UI', () => {
  before(() => {
    LoginPage.logout();
  });

  it('presents me with the login prompt', () => {
    BirthSearchPage.visit();
    LoginPage.shouldBeVisible();
  });

  describe('allows me to login to LEV', () => {
    before(() => {
      LoginPage.login();
    });
    it('presents me with a search form for births', () => {
      BirthSearchPage.visit();
      BirthSearchPage.shouldBeVisible();
    });
    describe('Birth registrations', () => {
      describe('Searching for a record', () => {
        it('presents me with the results page', () => {
          BirthSearchPage.visit();
          BirthSearchPage.performSearch('404404404');
          BirthResultsPage.shouldBeVisible();
        });
      });
      describe('Trying to access a non-existent record', () => {
        it('presents me with the NOT FOUND error page', () => {
          cy.visit('/details/404', {
            failOnStatusCode: false
          });
          ErrorPage.shouldBeOn404Page();
        });
      });
    });
  });
});
