'use strict';

describe('Accessing the UI', () => {
  it('Should pass', () => {
    cy.visit('/');
    cy.url()
      .should('include', 'dev');
  });
});
