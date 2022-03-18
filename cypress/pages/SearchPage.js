'use strict';

const Page = require('./Page');

class SearchPage extends Page {

  /**
   * Type the value into the selected field, or clear it.
   * @param selector
   * @param value
   */
  static setText(selector, value) {
    if (value) {
      cy.get(selector).type(value);
    }
  }

  /**
   * Submit the search
   */
  static submit() {
    cy.get('input[type="submit"]').click();
  }

  static hasErrorTitle() {
    cy.get('.validation-summary > h2').contains('Fix the following error');
  }

  static hasErrorMessage(message) {
    cy.get('.validation-summary a').contains(message);
  }

  static hasSystemNumberHint() {
    cy.get('#system-number-hint').should('exist');
  }

  static hasSurnameFocused() {
    cy.get('#surname').should('have.focus');
  }

  static hasForenamesFocused() {
    cy.get('#forenames').should('have.focus');
  }

}

module.exports = SearchPage;
