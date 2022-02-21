'use strict';

describe('Accessing the UI', () => {
  it('presents me with the login prompt', () => {
    cy.visit('/');
    cy.get('input[name="login"]').should('exist');
  });

  describe('allows me to login to LEV', () => {
    before(() => {
      cy.logout({
        root: 'https://sso-dev.notprod.homeoffice.gov.uk',
        realm: 'lev',
        // eslint-disable-next-line camelcase
        redirect_uri: Cypress.env('url')
      });

      cy.login({
        root: 'https://sso-dev.notprod.homeoffice.gov.uk',
        realm: 'lev',
        // eslint-disable-next-line camelcase
        redirect_uri: Cypress.env('url'),
        // eslint-disable-next-line camelcase
        client_id: 'lev-web',
        username: Cypress.env('username'),
        password: Cypress.env('password')
      });
    });
    it('should display the Birth search page', () => {

      // Visit birth page
      cy.visit('/');

      // Has title
      cy.get('h1').contains('Applicant\'s details');

      // Has focus
      cy.get('#system-number').should('have.focus');

      // Has labels
      cy.get('label[for=system-number]').contains('System number from birth certificate');
      cy.get('label[for=surname]').contains('Surname');
      cy.get('label[for=forenames]').contains('Forename(s)');
      cy.get('label[for=dob]').contains('Date of birth');
    });
  });
});
