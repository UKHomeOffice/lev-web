'use strict';

var mockProxy = require('./mock-proxy');
var expectedRecord = require('./expectedRecord');
var expectedRecords = require('./expectedRecords');
var testConfig = require('./config');

describe('Results page', function () {

  beforeEach(function () {
    browser.url(testConfig.url);
  });

  describe('When there are no results', function () {

    beforeEach(function () {
      mockProxy.willReturnForLocalTests(0);
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

    var givenNameSearch = expectedRecords.child.originalName.givenName.split(' ')[0]

    beforeEach(function () {
      mockProxy.willReturnForLocalTests(3);
      browser.setValue('input[name="surname"]', expectedRecords.child.originalName.surname);
      browser.setValue('input[name="forenames"]', givenNameSearch);
      browser.submitForm('form');
    });

    it('redirects to the results page', function () {
      browser.getUrl().should.contain('/results');
    });

    it('displays an appropriate message', function () {
      browser.getText('h1').should.equal('3 records found for ' + givenNameSearch + ' ' +
        expectedRecords.child.originalName.surname);
    });

    it('displays a subset of each record in a list', function () {
      var browserText = browser.getText('#records li tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      var fatherNameRegex = expectedRecords.father.name.givenName.split(' ')[0] + '.*' +
        expectedRecords.father.name.surname;
      var motherNameRegex = expectedRecords.mother.name.givenName.split(' ')[0] + '.*' +
        expectedRecords.mother.name.surname;
      browserText[0].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
      browserText[1].should.match(new RegExp('Father ?' + fatherNameRegex));
      browserText[2].should.match(new RegExp('Mother ?' + motherNameRegex));
      browserText[3].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
      browserText[4].should.match(new RegExp('Father ?' + fatherNameRegex));
      browserText[5].should.match(new RegExp('Mother ?' + motherNameRegex));
      browserText[6].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
      browserText[7].should.match(new RegExp('Father ?' + fatherNameRegex));
      browserText[8].should.match(new RegExp('Mother ?' + motherNameRegex));
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
      browser.waitForVisible('input[name="surname"]', 5000);
      browser.getValue('#surname').should.equal('Smith');

      browser.getValue('#forenames').should.equal('John');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
