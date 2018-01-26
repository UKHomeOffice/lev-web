'use strict';

// const moment = require('moment');
// const testConfig = require('../config');
// const env = testConfig.env;

describe('Error page', () => {

  describe('shown after a birth search error', () => {
    before('bad birth search', () => {
      browser.doBadBirthSearch();
    });

    it('should show the error page', () => {
      browser.shouldBeOn404Page();
    });

    describe('clicking the Start Again link', () => {
      before('click the Start Again link', () => {
        browser.click('a.button');
      });

      it('should take the user back to the Birth Search page', () => {
        browser.shouldBeOnSearchPage();
      });
    });
  });

});
