'use strict';

const Page = require('./Page');

class BackToSearchPage extends Page {

  /**
   * Check "New Search" button exists
   */
  static hasNewSearchButton() {
    cy.get('#newSearchLink').should('exist');
  }

  /**
   * Click the "New Search button
   */
  static clickNewSearchButton() {
    cy.get('#newSearchLink').click();
  }

  /**
   * Check "Edit Search" button exists
   */
  static hasEditSearchButton() {
    cy.get('#editSearchLink').should('exist');
  }

  /**
   * Click the "Edit Search button
   */
  static clickEditSearchButton() {
    cy.get('#editSearchLink').click();
  }

}

module.exports = BackToSearchPage;
