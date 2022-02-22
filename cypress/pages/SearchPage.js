'use strict';

class SearchPage {

  /**
   * Type the value into the selected field, or clear it.
   * @param selector
   * @param value
   */
  static setText(selector, value) {
    if (value) {
      cy.get(selector).type(value);
    } else {
      cy.get(selector).clear();
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
