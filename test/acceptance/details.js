'use strict';

var mockProxy = require('./mock-proxy');
var expectedRecord = require('./expectedRecord');

describe('Details Page @watch', function() {

  var urlShouldContainDetails = function urlShouldContainDetails() {
    it('the url should contain /details', function () {
      browser.getUrl().should.contain('/details');
    });
  };

  var messageDisplayed = function messageDisplayed() {
    it('an appropriate message is displayed', function () {
      browser.getText('h1').should.equal("Record of " + expectedRecord.subjects.child.name.fullName + " " + expectedRecord.subjects.child.dateOfBirth);
    });
  };

  var recordDisplayed = function recordDisplayed() {
    it('the complete record is displayed in a table', function () {
      browser.getText('table tr')
        .should.deep.equal([
          'System number ' + expectedRecord.systemNumber,
          'Surname ' + expectedRecord.subjects.child.name.surname,
          'Forename(s) ' + expectedRecord.subjects.child.name.givenName,
          'Date of birth ' + expectedRecord.subjects.child.dateOfBirth,
          'Sex ' + expectedRecord.subjects.child.sex,
          'Place of birth ' + expectedRecord.subjects.child.birthplace,
          'Mother ' + expectedRecord.subjects.mother.name.fullName,
          'Maiden name ' + expectedRecord.subjects.mother.maidenSurname,
          'Place of birth ' + expectedRecord.subjects.mother.birthplace,
          'Father ' + expectedRecord.subjects.father.name.fullName,
          'Place of birth ' + expectedRecord.subjects.father.birthplace,
          'Birth jointly registered No',
          'Registration district ' + expectedRecord.location.registrationDistrict,
          'Sub-district ' + expectedRecord.location.subDistrict,
          'Administrative area ' + expectedRecord.location.administrativeArea,
          'Date of registration ' + expectedRecord.date
        ]);
    });
  };

  beforeEach(function () {
    browser.url('http://localhost:8001/');
    browser.setValue('input[name="surname"]', expectedRecord.subjects.child.originalName.surname);
  });

  describe('When there is one result', function () {

    beforeEach(function () {
      mockProxy.willReturn(1);
      browser.setValue('input[name="forenames"]', expectedRecord.subjects.child.originalName.givenName);
      browser.submitForm('form');
    });

    urlShouldContainDetails();
    messageDisplayed();
    recordDisplayed();
  });

  describe('When there is more than one result', function () {

    beforeEach(function () {
      mockProxy.willReturn(2);
      browser.submitForm('form');
      browser.click("a[href=\"/details/" + expectedRecord.systemNumber + "\"]");
    });

    urlShouldContainDetails();
    messageDisplayed();
    recordDisplayed();
  });

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/');
      browser.setValue('input[name="surname"]', expectedRecord.subjects.child.originalName.surname);
      browser.setValue('input[name="forenames"]', expectedRecord.subjects.child.originalName.givenName);
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/');
      browser.setValue('input[name="surname"]', 'NotRealPersonSurname');
      browser.setValue('input[name="forenames"]', 'NotRealPersonForename');
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/');
    });
    it('has the correct form values', function () {
      browser.getValue('#content form > div:nth-child(2) > input').should.equal('NotRealPersonSurname');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getValue('#content form > div:nth-child(3) > input').should.equal('NotRealPersonForename');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
