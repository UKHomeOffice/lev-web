'use strict';

var mockProxy = require('../mock-proxy');
var expectedRecord = require('../expected-record');
var expectedRecords = require('../expected-records');
// var testConfig = require('../config');

describe('Details Page', () => {
  const urlShouldContainDetails = () => {
    it('returns a details page', () => {
      browser.shouldBeOnDetailsPage();
    });
  };

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      const h1 = `Record of ${recordToMatch.child.name.fullName} ${recordToMatch.child.dateOfBirth}`;
      browser.getText('h1').should.equal(h1);
    });
  };

  const recordDisplayed = (recordToMatch) => {
    it('the complete record is displayed in a table', () => {
      const browserText = browser.getText('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].should.match(new RegExp('System number *' + recordToMatch.systemNumber));
      browserText[2].should.match(new RegExp('Surname *' + recordToMatch.child.name.surname));
      browserText[3].should.match(new RegExp('Forename\\(s\\) *' + recordToMatch.child.name.givenName));
      browserText[4].should.match(new RegExp('Date of birth *' + recordToMatch.child.dateOfBirth));
      browserText[5].should.match(new RegExp('Sex *' + recordToMatch.child.sex));
      browserText[6].should.match(new RegExp('Place of birth *' + recordToMatch.child.birthplace));
      browserText[8].should.match(new RegExp('Mother\'s Name *' + recordToMatch.mother.name.fullName));
      browserText[9].should.match(new RegExp('Mother\'s Maiden name *' + recordToMatch.mother.maidenSurname));
      browserText[10].should.match(new RegExp(
        'Mother\'s Previous marriage name *' + recordToMatch.mother.marriageSurname));
      browserText[11].should.match(new RegExp('Mother\'s Place of birth *' + recordToMatch.mother.birthplace));
      browserText[13].should.match(new RegExp('Father\'s Name *' + recordToMatch.father.name.fullName));
      browserText[14].should.match(new RegExp('Father\'s Place of birth *' + recordToMatch.father.birthplace));
      browserText[16].should.match(new RegExp('Birth registered by *Mother'));
      browserText[17].should.match(new RegExp('Registration district *' + recordToMatch.registrationDistrict));
      browserText[18].should.match(new RegExp('Sub-district *' + recordToMatch.subDistrict));
      browserText[19].should.match(new RegExp('Administrative area *' + recordToMatch.administrativeArea));
      browserText[20].should.match(new RegExp('Date of registration *' + recordToMatch.date));
    });
  };

  const editSearchDisplayed = () => {
    it('contains a link back to the search screen', () => {
      browser.getText('body').should.contain('Edit search');
    });
  };

  const backToSearchResultsDisplayed = () => {
    it('contains a link back to the search screen', () => {
      browser.getText('body').should.contain('Back to results');
    });
  };

  const backToSearchResultsNotDisplayed = () => {
    it('does not contain a link back to the search screen', () => {
      browser.getText('body').should.not.contain('Back to search results');
    });
  };

  describe('When there is one result', () => {
    before(() => {
        const child = expectedRecord.child;
        const name = child.name;

        mockProxy.willReturnForLocalTests(1);
        browser.search('', name.surname, name.givenName, child.dateOfBirth);
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecord);
    recordDisplayed(expectedRecord);
    editSearchDisplayed();
    backToSearchResultsNotDisplayed();
  });

  describe('When there is more than one result', () => {

    before(() => {
      const child = expectedRecords.child;
      const name = child.name;

      mockProxy.willReturnForLocalTests(3);
      browser.search('', name.surname, name.givenName, '');
      const linkToFirstRecordDetails = 'a[href="/details/' + expectedRecords.systemNumber + '?surname=' +
        name.surname + '&forenames=' + name.givenName + '&multipleResults"]';
      browser.click(linkToFirstRecordDetails);
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecords);
    recordDisplayed(expectedRecords);
    editSearchDisplayed();
    backToSearchResultsDisplayed();
  });

  describe('When I select the "New search" button', () => {
    before(() => {
      const child = expectedRecord.child;
      const name = child.name;

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

  describe('When I select the "Edit search" link on the results page', () => {
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

  describe('When I select the "Edit search" link on the details page', () => {
    const child = expectedRecords.child;
    const name = child.name;

    before(() => {
      mockProxy.willReturnForLocalTests(3);
      browser.search('', name.surname, name.givenName, '');
      const linkToFirstRecordDetails = 'a[href="/details/' + expectedRecords.systemNumber + '?surname=' +
        name.surname + '&forenames=' + name.givenName + '&multipleResults"]';
      browser.click(linkToFirstRecordDetails);
      browser.click('#editSearchLink');
    });

    it('returns the search page', () => {
      browser.shouldBeOnSearchPage();
    });

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal(name.surname);
      browser.getValue('#forenames').should.equal(name.givenName);
      browser.getValue('#dob').should.equal('');
    });
  });

  describe('When I select the "Back to search results link on the results page"', () => {
    it('returned me to the results page', () => {
      const child = expectedRecords.child;
      const name = child.name;

      mockProxy.willReturnForLocalTests(3);
      browser.search('', name.surname, name.givenName, '');
      const linkToFirstRecordDetails = 'a[href="/details/' + expectedRecords.systemNumber + '?surname=' +
        name.surname + '&forenames=' + name.givenName + '&multipleResults"]';
      browser.click(linkToFirstRecordDetails);
      browser.click('#backToSearchResults');
      browser.getUrl().should.contain('surname=' + name.surname);
      browser.getUrl().should.contain('forenames=' + name.givenName);
      browser.shouldBeOnResultsPage();
    });
  });
});
