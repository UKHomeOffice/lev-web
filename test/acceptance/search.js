'use strict';

var mockProxy = require('./mock-proxy');
var expectedRecord = require('./expectedRecord');
var testConfig = require('./config');

describe('Search Page @watch', function() {

  beforeEach(function () {
    browser.url(testConfig.url);
  });

  describe('the form', function () {

    it('has a title', function () {
      browser.getText('h1').should.equal('Applicant\'s details');
    });

    it('has the correct form elements', function () {
      browser.getText('#content form > div:nth-child(1) > label').should.equal('System number from birth certificate');
      browser.waitForVisible('input[name="system-number"]', 5000);

      browser.getText('#content form > div:nth-child(2) > label').should.equal('Surname');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getText('#content form > div:nth-child(3) > label').should.equal('Forename(s)');
      browser.waitForVisible('input[name="forenames"]', 5000);

      browser.getText('#content form > div:nth-child(4) > label').should.equal('Date of birth');
      browser.waitForVisible('input[name="dob"]', 5000);
    });

  });

  describe('submitting a query', function () {

    describe('that returns no records', function () {

      beforeEach(function () {
        mockProxy.willReturn(0);
        browser.setValue('input[name="surname"]', 'Churchil');
        browser.setValue('input[name="forenames"]', 'Winston');
        browser.setValue('input[name="dob"]', '30/11/1874');
        browser.submitForm('form');
      });

      it('the url should contain /results', function () {
        browser.getUrl().should.contain('/results');
      });

    });

    describe('that returns 1 record', function () {

      beforeEach(function () {
        mockProxy.willReturn(1);
        browser.setValue('input[name="surname"]', expectedRecord.subjects.child.originalName.surname);
        browser.setValue('input[name="forenames"]', expectedRecord.subjects.child.originalName.givenName);
        browser.submitForm('form');
      });

      it('the url should contain /details', function () {
        browser.getUrl().should.contain('/details');
      });

    });

    describe('that returns more than 1 record', function () {

      beforeEach(function () {
        mockProxy.willReturn(2);
        browser.setValue('input[name="surname"]', 'Smith');
        browser.setValue('input[name="forenames"]', 'John');
        browser.submitForm('form');
      });

      it('redirects to the results page', function () {
        browser.getUrl().should.contain('/results');
      });

    });

  });

});
