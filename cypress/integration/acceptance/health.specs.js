'use strict';

describe('Health check', () => {
  describe('the "/healthz" endpoint', () => {
    it('should return a "200 - OK" status', () => {
      cy.request('/healthz').its('status').should('equal', 200);
    });
  });
  describe('the "/readiness" endpoint', () => {
    it('should return a "200 - OK" status', () => {
      cy.request('/readiness').its('status').should('equal', 200);
    });
  });
});
