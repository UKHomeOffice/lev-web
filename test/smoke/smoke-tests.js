'use strict';

const testConfig = require('./config');
const testURL = `${testConfig.url}/details/404`;

describe('Smoke Tests', () => {

  before(() => {
    require('../acceptance/mixins/login')(browser);
    browser.shouldBeOn404Page = () => {
      browser.getText('main').should.contain('Not found');
    };
  });

  describe('Trying to see a non-existent record', () => {
    before(() => {
      browser.url(testURL);
    });

    it('I am presented with the login prompt', () => {
      browser.shouldBeOnLoginPage();
    });

    it('I login to LEV', () => {
      browser.submitLoginPage(testConfig.username, testConfig.password);
    });

    it('I am presented with the NOT FOUND error page', () => {
      browser.shouldBeOn404Page();
    });
  });

});
