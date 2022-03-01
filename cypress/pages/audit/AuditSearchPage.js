'use strict';

const SearchPage = require('../SearchPage');

class AuditSearchPage extends SearchPage {

  static shouldBeVisible() {

    // Has title
    cy.get('h1').contains('Audit information');

    // Has focus
    cy.get('#from').should('have.focus');

    // Has labels
    cy.get('label[for=from]').contains('Search from');
    cy.get('label[for=to]').contains('Search to');
  }
}

module.exports = AuditSearchPage;
