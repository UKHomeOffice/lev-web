'use strict';

var mockProxy = require('../mock-proxy');
var expectedRecord = require('../expectedRecord');
var expectedRecords = require('../expectedRecords');
var testConfig = require('../config');

describe('Details Page', function () {

  var urlShouldContainDetails = function urlShouldContainDetails() {
    it('the url should contain /details', function () {
      browser.getUrl().should.contain('/details');
    });
  };

  var messageDisplayed = function messageDisplayed(recordToMatch) {
    it('an appropriate message is displayed', function () {
      browser.getText('h1').should.equal("Record of " + recordToMatch.child.name.fullName + " " + recordToMatch.child.dateOfBirth);
    });
  };

  var recordDisplayed = function recordDisplayed(recordToMatch) {
    it('the complete record is displayed in a table', function () {
      var browserText = browser.getText('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].should.match(new RegExp('System number *' + recordToMatch.systemNumber));
      browserText[1].should.match(new RegExp('Surname *' + recordToMatch.child.name.surname));
      browserText[2].should.match(new RegExp('Forename\\(s\\) *' + recordToMatch.child.name.givenName));
      browserText[3].should.match(new RegExp('Date of birth *' + recordToMatch.child.dateOfBirth));
      browserText[4].should.match(new RegExp('Sex *' + recordToMatch.child.sex));
      browserText[5].should.match(new RegExp('Place of birth *' + recordToMatch.child.birthplace));
      browserText[6].should.match(new RegExp('Mother *' + recordToMatch.mother.name.fullName));
      browserText[7].should.match(new RegExp('Maiden name *' + recordToMatch.mother.maidenSurname));
      browserText[8].should.match(new RegExp('Place of birth *' + recordToMatch.mother.birthplace));
      browserText[9].should.match(new RegExp('Father *' + recordToMatch.father.name.fullName));
      browserText[10].should.match(new RegExp('Place of birth *' + recordToMatch.father.birthplace));
      browserText[11].should.match(new RegExp('Birth jointly registered *No'));
      browserText[12].should.match(new RegExp('Registration district *' + recordToMatch.registrationDistrict));
      browserText[13].should.match(new RegExp('Sub-district *' + recordToMatch.subDistrict));
      browserText[14].should.match(new RegExp('Administrative area *' + recordToMatch.administrativeArea));
      browserText[15].should.match(new RegExp('Date of registration *' + recordToMatch.date));
    });
  };

  beforeEach(function () {
    browser.url(testConfig.url);
  });

  describe('When there is one result', function () {

    beforeEach(function () {
      browser.setValue('input[name="surname"]', expectedRecord.child.originalName.surname);
      browser.setValue('input[name="forenames"]', expectedRecord.child.originalName.givenName);
      mockProxy.willReturnForLocalTests(1);
      browser.submitForm('form');
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecord);
    recordDisplayed(expectedRecord);
  });

  describe('When there is more than one result', function () {

    beforeEach(function () {
      browser.setValue('input[name="surname"]', expectedRecords.child.originalName.surname);
      mockProxy.willReturnForLocalTests(3);
      browser.submitForm('form');
      browser.click("a[href=\"/details/" + expectedRecords.systemNumber + "\"]");
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecords);
    recordDisplayed(expectedRecords);
  });

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.url(testConfig.url);
      browser.setValue('input[name="surname"]', expectedRecord.child.originalName.surname);
      browser.setValue('input[name="forenames"]', expectedRecord.child.originalName.givenName);
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.url(testConfig.url);
      browser.setValue('input[name="surname"]', 'NotRealPersonSurname');
      browser.setValue('input[name="forenames"]', 'NotRealPersonForename');
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
    it('has the correct form values', function () {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#surname').should.equal('NotRealPersonSurname');
      browser.getValue('#forenames').should.equal('NotRealPersonForename');
    });
  });

});
