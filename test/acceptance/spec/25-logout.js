'use strict';

var testConfig = require('../config');

if (testConfig.env !== 'local') {
  describe('Logout', () => {
    describe('when I logout', () => {
      before(() => {
        browser.logout();
      });

      it('redirects me to the login page', () => {
        browser.shouldBeOnLoginPage();
      });

      it('makes me login again before using the application', () => {
        browser.url(testConfig.url);
        browser.shouldBeOnLoginPage();
      });
    });
  });
}
