'use strict';

const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

if (Cypress.env('e2e')) {
  describe('Logout', () => {
    before(() => {
      LoginPage.login();
    });

    describe('when I logout', () => {
      before(() => {
        HomePage.visit();
        HomePage.shouldBeVisible();
        HomePage.clickLogoutButton();
      });

      it('redirects me to the login page', () => {
        LoginPage.shouldBeVisible();
      });

      it('makes me login again before using the application', () => {
        HomePage.visit();
        LoginPage.shouldBeVisible();
      });
    });
  });
}
