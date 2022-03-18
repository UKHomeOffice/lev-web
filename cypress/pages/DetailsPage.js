'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class DetailsPage extends BackToSearchPage {

  /**
   * Check the details page is visible
   */
  static shouldBeVisible() {
    cy.url().should('include', '/details');
  }

  /**
   * Check the "Back to results" button is visible
   */
  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  /**
   * Check the "Back to results" button is NOT visible
   */
  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }

  /**
   * Click the "Back to results" button
   */
  static clickBackToResultsButton() {
    cy.get('#backToSearchResults').click();
  }

  /**
   * Check the expected rows are displayed
   * @param rows
   */
  static hasExpectedRows(rows) {
    cy.get('table.details tr').each((element, index) => {
      cy.wrap(element).contains(rows[index]);
    });
  }
}

module.exports = DetailsPage;
