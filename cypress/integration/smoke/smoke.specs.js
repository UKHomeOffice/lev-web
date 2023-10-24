'use strict';

const BirthSearchPage = require('../../pages/birth/BirthSearchPage');
const BirthResultsPage = require('../../pages/birth/BirthResultsPage');
const DeathSearchPage = require('../../pages/death/DeathSearchPage');
const DeathResultsPage = require('../../pages/death/DeathResultsPage');
const LoginPage = require('../../pages/LoginPage');
const MarriageSearchPage = require('../../pages/marriage/MarriageSearchPage');
const MarriageResultsPage = require('../../pages/marriage/MarriageResultsPage');
const PartnershipSearchPage = require('../../pages/partnership/PartnershipSearchPage');
const PartnershipResultsPage = require('../../pages/partnership/PartnershipResultsPage');
const SearchErrorPage = require('../../pages/SearchErrorPage');

describe('Smoke Tests', () => {
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
    });
  });

  describe('Birth registrations', () => {
    before(() => {
      LoginPage.login();
    });

    describe('Searching for a record', () => {
      it('presents me with the results page', () => {
        BirthSearchPage.visit();
        BirthSearchPage.shouldBeVisible();
        BirthSearchPage.performSearch({ systemNumber: '404404404' });
        BirthResultsPage.shouldBeVisible();
      });
    });

    describe('Trying to access a non-existent record', () => {
      it('presents me with the NOT FOUND error page', () => {
        SearchErrorPage.visit('/details/404');
        SearchErrorPage.shouldBeVisible();
      });
    });
  });

  describe('Death registrations', () => {
    before(() => {
      LoginPage.login();
    });

    describe('Searching for a record', () => {
      it('presents me with the results page', () => {
        DeathSearchPage.visit();
        DeathSearchPage.shouldBeVisible();
        DeathSearchPage.performSearch({ systemNumber: '404404404' });
        DeathResultsPage.shouldBeVisible();
      });
    });

    describe('Trying to access a non-existent record', () => {
      it('presents me with the NOT FOUND error page', () => {
        SearchErrorPage.visit('/death/details/404');
        SearchErrorPage.shouldBeVisible();
      });
    });
  });

  describe('Marriage registrations', () => {
    before(() => {
      LoginPage.login();
    });

    describe('Searching for a record', () => {
      it('presents me with the results page', () => {
        MarriageSearchPage.visit();
        MarriageSearchPage.shouldBeVisible();
        MarriageSearchPage.performSearch({ systemNumber: '404404404' });
        MarriageResultsPage.shouldBeVisible();
      });
    });

    describe('Trying to access a non-existent record', () => {
      it('presents me with the NOT FOUND error page', () => {
        SearchErrorPage.visit('/marriage/details/404');
        SearchErrorPage.shouldBeVisible();
      });
    });
  });

  describe('Partnership registrations', () => {
    before(() => {
      LoginPage.login();
    });

    describe('Searching for a record', () => {
      it('presents me with the results page', () => {
        PartnershipSearchPage.visit();
        PartnershipSearchPage.shouldBeVisible();
        PartnershipSearchPage.performSearch({ systemNumber: '404404404' });
        PartnershipResultsPage.shouldBeVisible();
      });
    });

    describe('Trying to access a non-existent record', () => {
      it('presents me with the NOT FOUND error page', () => {
        SearchErrorPage.visit('/partnership/details/404');
        SearchErrorPage.shouldBeVisible();
      });
    });
  });
});
