'use strict';

class LoginPage {

  /**
   * Logout
   */
  static logout() {
    cy.logout(Cypress.env('keycloak'));
  }

  /**
   * Login using keycloak
   */
  static login() {
    this.logout();
    cy.login(Cypress.env('keycloak'));
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
