'use strict';

describe('Query Page', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001');
  });

  describe('the form', function () {

    it('has a title', function () {
      browser.getText('h1').should.equal('Applicants Details');
    });

    it('has the correct form elements', function () {
      browser.getText('#content form > div:nth-child(1) > label').should.equal('System number');
      browser.waitForVisible('input[name="system-number"]', 5000);

      browser.getText('#content form > div:nth-child(2) > label').should.equal('Surname');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getText('#content form > div:nth-child(3) > label').should.equal('Forename(s)');
      browser.waitForVisible('input[name="forenames"]', 5000);

      browser.getText('#content form > div:nth-child(4) > label').should.equal('Date of birth');
      browser.waitForVisible('input[name="dob"]', 5000);
    });

  });

  describe('submitting', function () {

    it('submits all the data and redirects to the results page @watch', function () {
      browser.setValue('input[name="system-number"]', '123456');
      browser.setValue('input[name="surname"]', 'Churchil')
      browser.setValue('input[name="forenames"]', 'Winston')
      browser.setValue('input[name="dob"]', '30/11/1874');
      browser.submitForm('form');

      // results page loaded
      browser.waitForText('h1', 'Record of', 5000);
    });

  });

});