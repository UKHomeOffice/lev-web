'use strict';

const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

if (Cypress.env('e2e')) {
  describe('Login', () => {
    describe('When I try to use the service', () => {
      it('makes me login first', () => {
        LoginPage.logout();
        HomePage.visit();
        LoginPage.shouldBeVisible();
      });
    });

    describe('When I login with invalid credentials', () => {
      before(() => {
        LoginPage.loginWithBadCredentials();
      });

      it('displays an error', () => {
        LoginPage.shouldBeVisible();
      });

      it('still doesn\'t let me in', () => {
        HomePage.visit();
        LoginPage.shouldBeVisible();
      });
    });

    describe('When I login with valid credentials', () => {
      before(() => {
        LoginPage.login();
      });

      it('lets me through to the next page', () => {
        HomePage.visit();
        HomePage.shouldBeVisible();
      });
    });
  });
}
