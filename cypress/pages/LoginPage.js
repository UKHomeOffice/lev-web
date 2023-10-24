'use strict';

class LoginPage {

  /**
   * Logout
   */
  static logout() {
    if (Cypress.env('e2e')) {
      cy.logout(Cypress.env('keycloak'));
    }
  }

  /**
   * Login using keycloak with valid credentials
   */
  static login() {
    if (Cypress.env('e2e')) {
      this.logout();
      cy.login(Cypress.env('keycloak'));
    }
  }

  /**
   * Login using keycloak with invalid credentials
   */
  static loginWithBadCredentials() {
    if (Cypress.env('e2e')) {
      const keycloak = Cypress.env('keycloak');

      cy.login({
        root: keycloak.root,
        realm: keycloak.realm,
        username: 'invalid-username',
        password: 'invalid-password',
        // eslint-disable-next-line camelcase
        client_id: keycloak.client_id,
        // eslint-disable-next-line camelcase
        redirect_uri: keycloak.redirect_uri
      });
    }
  }

  /**
   * Check the login page is visible
   */
  static shouldBeVisible() {

    // Has login button
    cy.get('#kc-login').should('exist');
  }
}

module.exports = LoginPage;
