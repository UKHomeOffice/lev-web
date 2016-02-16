'use strict';

var mockProxy = require('./mock-proxy');

describe('Details Page @watch', function() {

  var urlShouldContain = function urlShouldContain() {
    it('the url should contain /details', function () {
      browser.getUrl().should.contain('/details');
    });
  };

  var messageDisplayed = function messageDisplayed() {
    it('an appropriate message is displayed', function () {
      browser.getText('h1').should.equal('Record of Joan Narcissus Ouroboros Smith 08/08/2008');
    });
  };

  var recordDisplayed = function recordDisplayed() {
    it('the complete record is displayed in a table', function () {
      browser.getText('table tr')
        .should.deep.equal([
          'System number 1',
          'Surname Smith',
          'Forename(s) Joan Narcissus Ouroboros',
          'Date of birth 08/08/2008',
          'Sex Indeterminate',
          'Place of birth Kensington',
          'Mother Joan Narcissus Ouroboros Smith',
          'Maiden name Black',
          'Place of birth Kensington',
          'Father Joan Narcissus Ouroboros Smith',
          'Place of birth Kensington',
          'Birth jointly registered No*',
          'Registration district Manchester',
          'Sub-district Manchester',
          'Administrative area Metropolitan District of Manchester',
          'Date of registration 09/08/2008'
        ]);
    });
  };

  beforeEach(function () {
    browser.url('http://localhost:8001/search');
    browser.setValue('input[name="surname"]', 'Smith');
  });

  describe('When there is one result', function () {

    beforeEach(function () {
      mockProxy.willReturn(1);
      browser.setValue('input[name="forenames"]', 'Joan Narcissus Ouroboros');
      browser.submitForm('form');
    });

    urlShouldContain();
    messageDisplayed();
    recordDisplayed();
  });

  describe('When there is more than one result', function () {

    beforeEach(function () {
      mockProxy.willReturn(2);
      browser.submitForm('form');
      browser.click('a[href="/details/1"]');
    });

    urlShouldContain();
    messageDisplayed();
    recordDisplayed();
  });

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/search');
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John Francis');
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/search');
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John Francis');
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
    it('has the correct form values', function () {
      browser.getValue('#content form > div:nth-child(2) > input').should.equal('Smith');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getValue('#content form > div:nth-child(3) > input').should.equal('John Francis');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
