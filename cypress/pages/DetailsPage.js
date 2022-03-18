'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class DetailsPage extends BackToSearchPage {

  static shouldBeVisible() {
    cy.url().should('include', '/details');
  }

  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }

  static clickBackToResultsButton() {
    cy.get('#backToSearchResults').click();
  }

  static hasExpectedRows(rows) {
    cy.get('table.details tr').each((element, index) => {
      cy.wrap(element).contains(rows[index]);
    });
  }
}

module.exports = DetailsPage;
