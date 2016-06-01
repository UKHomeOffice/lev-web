'use strict';

var mockProxy = require('../mock-proxy');
var expectedRecord = require('../expectedRecord');
var expectedRecords = require('../expectedRecords');
var testConfig = require('../config');

describe('Details Page', () => {
  const urlShouldContainDetails = () => {
    it('returns a details page', () => {
      browser.shouldBeOnDetailsPage();
    });
  };

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      browser.getText('h1').should.equal("Record of " + recordToMatch.child.name.fullName + " " + recordToMatch.child.dateOfBirth);
    });
  };

  const recordDisplayed = (recordToMatch) => {
    it('the complete record is displayed in a table', () => {
      const browserText = browser.getText('table tr');
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

  describe('When there is one result', () => {
    before(() => {
        const child = expectedRecord.child;
        const name = child.originalName;

        mockProxy.willReturnForLocalTests(1);
        browser.search('', name.surname, name.givenName, child.dateOfBirth);
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecord);
    recordDisplayed(expectedRecord);
  });

  describe('When there is more than one result', () => {

    before(() => {
      const child = expectedRecords.child;
      const name = child.originalName;

      mockProxy.willReturnForLocalTests(3);
      browser.search('', name.surname, name.givenName, '');
      browser.click("a[href=\"/details/" + expectedRecords.systemNumber + "\"]");
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecords);
    recordDisplayed(expectedRecords);
  });

  describe('When I select the "New search" button', () => {
    before(() => {
      const child = expectedRecord.child;
      const name = child.originalName;

      mockProxy.willReturnForLocalTests(1);
      browser.search('', name.surname, name.givenName, child.dateOfBirth);
      browser.click('#newSearchLink');
    });

    it('returns the search page', () => {
      browser.shouldBeOnSearchPage();
    });

    it('has empty form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('');
      browser.getValue('#forenames').should.equal('');
      browser.getValue('#dob').should.equal('');
    });
  });

  describe('When I select the "Edit search" link', () => {
    before(() => {
      mockProxy.willReturnForLocalTests(0);
      browser.search('', 'NotRealPersonSurname', 'NotRealPersonForename', '01/01/2010');
      browser.click('#editSearchLink');
    });

    it('returns the search page', () => {
      browser.shouldBeOnSearchPage();
    });

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('NotRealPersonSurname');
      browser.getValue('#forenames').should.equal('NotRealPersonForename');
      browser.getValue('#dob').should.equal('01/01/2010');
    });
  });
});
