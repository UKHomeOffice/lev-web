'use strict';

describe('Login Page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001/');
  });

  describe('the form', function () {

    it('has a title', function () {
      browser.getText('h1').should.equal('Log in');
    });

    it('has the correct form elements', function () {
      browser.getText('#content form > div:nth-child(1) > label').should.equal('Username');
      browser.waitForVisible('input[name="username"]', 5000);

      browser.getText('#content form > div:nth-child(2) > label').should.equal('Password');
      browser.waitForVisible('input[name="password"]', 5000);
    });

  });

  describe('Submitting log in details', function () {

    describe('Logs the user in', function () {

      beforeEach(function () {
        browser.setValue('input[name="username"]', 'user123');
        browser.setValue('input[name="password"]', 'pass123');
        browser.submitForm('form');
      });

      it('the url should contain /search', function () {
        browser.getUrl().should.contain('/search');
      });

    });

  });

});
