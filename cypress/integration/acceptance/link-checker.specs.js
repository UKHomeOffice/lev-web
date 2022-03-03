'use strict';

const LoginPage = require('../../pages/LoginPage');

const checkPageLinks = (url, failOnStatusCode = true) => {
  describe(url, () => {
    it('should have no broken links', () => {
      cy.visit(url, { failOnStatusCode });
      cy.get('a').each(link => {
        expect(link, link.text()).to.have.attr('href').not.contain('undefined');
      });
    });
  });
};

describe('Check for broken links', () => {
  before(() => {
    LoginPage.login();
  });

  /* eslint-disable array-bracket-spacing, no-inline-comments */
  describe('on regular pages', () => {
    [
      '/',                                                       // the search page
      '/?system-123',                                            // the search page (with help image displayed)
      '/?surname=multiple&forenames=tester&dob=010110',          // the results page
      '/details/999999910',                                      // the details page
      '/death',                                                  // the death search page
      '/death/',                                                 // the death search page
      '/death/?surname=multiple&forenames=tester&dobd=010110',   // the death results page
      '/death/details/999999910',                                // the death details page
      '/marriage',                                               // the marriage search page
      '/marriage/',                                              // the marriage search page
      '/marriage/?surname=multiple&forenames=tester&dom=010110', // the marriage results page
      '/marriage/details/999999910',                             // the marriage details page
      '/audit/user-activity/?from=010118&to=210118'              // the audit page
    ].forEach(url => checkPageLinks(url));
  });

  describe('on error pages', () => {
    [
      '/details/123',                               // 404
      '/death/details/123',                         // 404
      '/marriage/details/123',                      // 404
      '/partnership/details/123',                   // 404
      '/audit/user-activity/?from=010111&to=010112' // 500
    ].forEach(url => checkPageLinks(url, false));
  });
  /* eslint-enable array-bracket-spacing, no-inline-comments */
});
