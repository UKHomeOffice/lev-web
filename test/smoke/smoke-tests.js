'use strict';

const testConfig = require('./config');
const testURL = `${testConfig.url}/details/404`;

describe('Smoke Tests', () => {

  before(() => {
    require('../acceptance/mixins/login')(browser);
    require('../acceptance/mixins/error')(browser);
  });

  describe('Trying to see a non-existent record', () => {
    before(() => {
      browser.url(testURL);
    });

    it('presents me with the login prompt', () => {
      browser.shouldBeOnLoginPage();
    });

    it('allows me to login to LEV', () => {
      browser.completeLoginPage(testConfig.username, testConfig.password);
    });

    it('presents me with the NOT FOUND error page', () => {
      browser.shouldBeOn404Page();
    });
  });

});
