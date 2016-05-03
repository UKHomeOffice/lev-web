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
      browser.waitForVisible('input[name="system-number"]', 5000);
      var formLabels = browser.getText('label');
      formLabels[0].should.equal('System number from birth certificate');
      formLabels[1].should.equal('Surname');
      formLabels[2].should.equal('Forename(s)');
      formLabels[3].should.equal('Date of birth');
    });

  });

  describe('submitting a query', function () {

    describe('that returns no records', function () {

      beforeEach(function () {
        mockProxy.willReturnForLocalTests(0);
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
        mockProxy.willReturnForLocalTests(1);
        browser.setValue('input[name="surname"]', expectedRecord.child.originalName.surname);
        browser.setValue('input[name="forenames"]', expectedRecord.child.originalName.givenName);
        browser.submitForm('form');
      });

      it('the url should contain /details', function () {
        browser.getUrl().should.contain('/details');
      });

    });

    describe('that returns more than 1 record', function () {

      beforeEach(function () {
        mockProxy.willReturnForLocalTests(3);
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
