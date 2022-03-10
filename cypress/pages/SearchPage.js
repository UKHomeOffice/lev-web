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
}

module.exports = SearchPage;
