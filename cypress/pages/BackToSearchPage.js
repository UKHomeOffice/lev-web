'use strict';

const Page = require('./Page');

class BackToSearchPage extends Page {

  /**
   * Check "New Search" link exists
   */
  static hasNewSearchLink() {
    cy.get('#newSearchLink').should('exist');
  }

  /**
   * Check "Edit Search" link exists
   */
  static hasEditSearchLink() {
    cy.get('#editSearchLink').should('exist');
  }
}

module.exports = BackToSearchPage;
