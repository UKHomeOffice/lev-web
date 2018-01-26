'use strict';

describe('Error page', () => {

  describe('shown after a birth search error', () => {
    before('bad birth search', () => {
      browser.doBadBirthSearch();
    });

    it('should show the error page', () => {
      browser.shouldBeOn404Page();
    });

    describe('has a Start Again link which', () => {
      before('click the Start Again link', () => {
        browser.click('a.button');
      });

      it('should take the user back to the Birth Search page', () => {
        browser.shouldBeOnSearchPage();
      });
    });
  });

  describe('shown after an audit report search error', () => {
    before('bad audit search', () => {
      browser.doBadAuditSearch();
    });

    it('should show the error page', () => {
      browser.shouldBeOnErrorPage();
    });

    describe('has a Start Again link which', () => {
      before('click the Start Again link', () => {
        browser.click('a.button');
      });

      it('should take the user back to the User Activity Report page', () => {
        browser.shouldBeOnUserActivityReport();
      });
    });
  });

});
