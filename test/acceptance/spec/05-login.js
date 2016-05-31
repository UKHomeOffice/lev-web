'use strict';

const testConfig = require('../config');

if (testConfig.env !== 'local') {
  describe('Login', () => {
    describe('When I try to use the service', () => {
      before(() => {
        browser.url(testConfig.url);
      });

      it('makes me login first', () => {
        browser.shouldBeOnLoginPage();
      });
    });

    describe('When I login with invalid credentials', () => {
      before(() => {
        browser.submitLoginPage('invalid-username', 'invalid-password');
      });

      it('displays an error', () => {
        browser.getText('body').should.have.string('Invalid username or password');
      });

      it('still doesn\'t let me in', () => {
        browser.url(testConfig.url);

        browser.shouldBeOnLoginPage();
      });
    });

    describe('When I login with valid credentials', () => {
      before(() => {
        browser.submitLoginPage(testConfig.username, testConfig.password);
      });

      it('lets me through to the next page', () => {
        browser.shouldBeOnSearchPage();
      });
    });
  });
}
