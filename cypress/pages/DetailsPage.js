'use strict';

const BackToSearchPage = require('./BackToSearchPage');

class DetailsPage extends BackToSearchPage {

  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }
}

module.exports = DetailsPage;
