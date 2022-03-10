'use strict';

const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

if (Cypress.env('e2e')) {
  describe('Logout', () => {
    before(() => {
      LoginPage.login();
      HomePage.visit();
    });

    describe('when I logout', () => {
      it('redirects me to the login page', () => {
        HomePage.clickLogoutButton();
        LoginPage.shouldBeVisible();
      });

      it('makes me login again before using the application', () => {
        LoginPage.login();
        HomePage.visit();
        HomePage.shouldBeVisible();
      });
    });
  });
}
