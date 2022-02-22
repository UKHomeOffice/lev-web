'use strict';

class LoginPage {

  /**
   * Logout
   */
  static logout() {
    cy.logout({
      root: 'https://sso-dev.notprod.homeoffice.gov.uk',
      realm: 'lev',
      // eslint-disable-next-line camelcase
      redirect_uri: Cypress.env('url')
    });
  }

  /**
   * Login using keycloak
   */
  static login() {
    this.logout();

    cy.login({
      root: 'https://sso-dev.notprod.homeoffice.gov.uk',
      realm: 'lev',
      // eslint-disable-next-line camelcase
      redirect_uri: Cypress.env('url'),
      // eslint-disable-next-line camelcase
      client_id: 'lev-web',
      username: Cypress.env('username'),
      password: Cypress.env('password')
    });
  }

  /**
   * Check the login page is visible
   */
  static shouldBeVisible() {

    // Has login button
    cy.get('input[name="login"]').should('exist');
  }
}

module.exports = LoginPage;
