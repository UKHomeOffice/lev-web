describe('My first test', () => {

  it('Test LOCAL, Should display the birth page', () => {
    cy.visit('http://localhost:8001');

    cy.contains('Birth record check');

    cy.get('#system-number')
      .type('123456789');

    cy.get('input[type="submit"]')
      .click();

    cy.url()
      .should('include', 'details/123456789?system-number=123456789');
  });

  it('Test DEV, Should display the birth page', () => {
    cy.logout({
      root: 'https://sso-dev.notprod.homeoffice.gov.uk',
      realm: 'lev',
      // eslint-disable-next-line camelcase
      redirect_uri: 'https://dev.notprod.lev.homeoffice.gov.uk'
    });

    cy.login({
      root: 'https://sso-dev.notprod.homeoffice.gov.uk',
      realm: 'lev',
      // eslint-disable-next-line camelcase
      redirect_uri: 'https://dev.notprod.lev.homeoffice.gov.uk',
      // eslint-disable-next-line camelcase
      client_id: 'lev-web',
      username: 'xxxxx',
      password: 'xxxxx'
    });

    cy.visit('https://dev.notprod.lev.homeoffice.gov.uk/');

    cy.contains('Birth record check');

    cy.get('#system-number')
      .type('123456789');

    cy.get('input[type="submit"]')
      .click();

    cy.url()
      .should('include', 'details/123456789?system-number=123456789');
  });
});
