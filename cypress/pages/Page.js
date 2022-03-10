'use strict';

class Page {

  /**
   * Click the logout button
   */
  static clickLogoutButton() {
    cy.get('#sign-out').click();
  }
}

module.exports = Page;
