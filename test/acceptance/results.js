'use strict';

var mockProxy = require('./mock-proxy');
var expectedRecord = require('./expectedRecord');
var testConfig = require('./config');

describe('Results page @watch', function() {

  beforeEach(function () {
    browser.url(testConfig.url);
    console.log("WHAT IF I GET THE URL HERE?: "+browser.getUrl())
  });

  describe('When there are no results', function () {

    beforeEach(function () {
      mockProxy.willReturn(0);
      console.log("WHAT IF I GET THE URL HERE 222222222222?: "+browser.getUrl())
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
      browser.setValue('input[name="surname"]', expectedRecord.subjects.child.originalName.surname);
      browser.setValue('input[name="forenames"]', expectedRecord.subjects.child.originalName.givenName);
      browser.submitForm('form');
    });

    it('redirects to the results page', function () {
      browser.getUrl().should.contain('/results');
    });

    it('displays an appropriate message', function () {
      browser.getText('h1').should.equal('3 records found for ' + expectedRecord.subjects.child.originalName.fullName);
    });

    it('displays a subset of each record in a list', function () {
      browser.getText('#records li tr')
        .should.deep.equal([
          'Place of birth ' + expectedRecord.subjects.child.birthplace,
          'Father ' + expectedRecord.subjects.father.name.fullName,
          'Mother ' + expectedRecord.subjects.mother.name.fullName,
          'Place of birth ' + expectedRecord.subjects.child.birthplace,
          'Father ' + expectedRecord.subjects.father.name.fullName,
          'Mother ' + expectedRecord.subjects.mother.name.fullName,
          'Place of birth ' + expectedRecord.subjects.child.birthplace,
          'Father ' + expectedRecord.subjects.father.name.fullName,
          'Mother ' + expectedRecord.subjects.mother.name.fullName
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
