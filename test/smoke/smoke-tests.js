'use strict';

const testConfig = require('./config');

describe('Smoke Tests', () => {

  before(() => {
    require('../acceptance/mixins/login')(browser);
    require('../acceptance/mixins/error')(browser);
    require('../acceptance/mixins/results')(browser);
    require('../acceptance/mixins/search')(browser);
  });

  describe('Accessing the UI', () => {
    before(() => {
      browser.url(testConfig.url);
    });

    it('presents me with the login prompt', () => {
      browser.shouldBeOnLoginPage();
    });

    describe('allows me to login to LEV', () => {
      before(() => {
        browser.completeLoginPage(testConfig.username, testConfig.password);
      });

      it('presents me with a search form for births', () => {
        browser.shouldBeOnBirthSearchPage();
      });
    });
  });

  describe('Birth registrations', () => {
    describe('Searching for a record', () => {
      before(() => {
        browser.birthSearch('404404404', '', '', '');
      });

      it('presents me with the results page', () => {
        browser.shouldBeOnBirthResultsPage();
      });
    });

    describe('Trying to access a non-existent record', () => {
      before(() => {
        browser.url(`${testConfig.url}/details/404`);
      });

      it('presents me with the NOT FOUND error page', () => {
        browser.shouldBeOn404Page();
      });
    });
  });

  describe('Death registrations', () => {
    describe('Searching for a record', () => {
      before(() => {
        browser.deathSearch('404404404', '', '', '');
      });

      it('presents me with the results page', () => {
        browser.shouldBeOnDeathResultsPage();
      });
    });

    describe('Trying to access a non-existent record', () => {
      before(() => {
        browser.url(`${testConfig.url}/death/details/404`);
      });

      it('presents me with the NOT FOUND error page', () => {
        browser.shouldBeOn404Page();
      });
    });
  });
});
