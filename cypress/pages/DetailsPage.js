'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class DetailsPage extends BackToSearchPage {

  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }

  static clickBackToResultsButton() {
    cy.get('#backToSearchResults').click();
  }
}

module.exports = DetailsPage;
