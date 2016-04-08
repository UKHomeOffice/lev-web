'use strict';

var mockProxy = require('./mock-proxy');

describe('Results page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001/');
  });

  describe('When there are no results', function () {

    beforeEach(function () {
      mockProxy.willReturn(0);
      browser.setValue('input[name="surname"]', 'Churchil');
      browser.setValue('input[name="forenames"]', 'Winston');
      browser.setValue('input[name="dob"]', '30/11/1874');
      browser.submitForm('form');
    });

    it('redirects to the results page', function () {
      browser.getUrl().should.contain('/results');
    });

    it('displays an appropriate message', function () {
      browser.getText('h1').should.equal('No records found for Winston Churchil 30/11/1874');
    });

  });

  describe('When there is more than one result', function () {

    beforeEach(function () {
      mockProxy.willReturn(3);
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'Joan Narcissus Ouroboros');
      browser.submitForm('form');
    });

    it('redirects to the results page', function () {
      browser.getUrl().should.contain('/results');
    });

    it('displays an appropriate message', function () {
      browser.getText('h1').should.equal('3 records found for Joan Narcissus Ouroboros Smith');
    });

    it('displays a subset of each record in a list', function () {
      browser.getText('#records li tr')
        .should.deep.equal([
          'Place of birth Kensington',
          'Father Joan Narcissus Ouroboros Smith',
          'Mother Joan Narcissus Ouroboros Smith',
          'Place of birth Kensington',
          'Father Joan Narcissus Ouroboros Smith',
          'Mother Joan Narcissus Ouroboros Smith',
          'Place of birth Kensington',
          'Father Joan Narcissus Ouroboros Smith',
          'Mother Joan Narcissus Ouroboros Smith'
        ]);
    });

  });

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John');
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John');
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
    it('has the correct form values', function () {
      browser.getValue('#content form > div:nth-child(2) > input').should.equal('Smith');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getValue('#content form > div:nth-child(3) > input').should.equal('John');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
