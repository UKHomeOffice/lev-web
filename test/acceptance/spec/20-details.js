'use strict';

var expectedRecord = require('../expected-record');
var expectedRecords = require('../expected-records');

describe('Details Page', () => {
  const urlShouldContainDetails = () => it('returns a details page', () => browser.shouldBeOnDetailsPage());

  const urlShouldContainSearch = () => it('returns the search page', () => browser.shouldBeOnSearchPage());

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      const h1 = `${recordToMatch.child.name.fullName} ${recordToMatch.child.dateOfBirth}`;
      browser.getText('h1').should.equal(h1);
    });
  };

  const recordDisplayed = (record) => {
    it('the complete record is displayed in a table', () => {
      const browserText = browser.$$('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].getText().should.match(new RegExp('System number *' + record.systemNumber));
      browserText[2].getText().should.match(new RegExp('Surname *' + record.child.name.surname));
      browserText[3].getText().should.match(new RegExp('Forename\\(s\\) *' + record.child.name.givenName));
      browserText[4].getText().should.match(new RegExp('Date of birth *' + record.child.dateOfBirth));
      browserText[5].getText().should.match(new RegExp('Sex *' + record.child.sex));
      browserText[6].getText().should.match(new RegExp('Place of birth *' + record.child.birthplace));
      browserText[8].getText().should.match(new RegExp('Name *' + record.mother.name.fullName));
      browserText[9].getText().should.match(new RegExp('Maiden name *' + record.mother.maidenSurname));
      browserText[10].getText().should.match(new RegExp('Previous marriage name *' + record.mother.marriageSurname));
      browserText[11].getText().should.match(new RegExp('Place of birth *' + record.mother.birthplace));
      browserText[13].getText().should.match(new RegExp('Name *' + record.father.name.fullName));
      browserText[14].getText().should.match(new RegExp('Place of birth *' + record.father.birthplace));
      browserText[16].getText().should.match(new RegExp('Birth registered by *Mother'));
      browserText[17].getText().should.match(new RegExp('Registration district *' + record.registrationDistrict));
      browserText[18].getText().should.match(new RegExp('Sub-district *' + record.subDistrict));
      browserText[19].getText().should.match(new RegExp('Administrative area *' + record.administrativeArea));
      browserText[20].getText().should.match(new RegExp('Date of registration *' + record.date));
    });
  };

  const editSearchDisplayed = () =>
    it('contains a link back to the search screen', () => browser.getText('body').should.contain('Edit search'));

  const backToSearchResultsDisplayed = () =>
    it('contains a link back to the search screen', () => browser.getText('body').should.contain('Back to results'));

  const backToSearchResultsNotDisplayed = () => {
    it('does not contain a link back to the search screen', () =>
      browser.getText('body').should.not.contain('Back to search results'));
  };

  describe('When there is one result', () => {
    before(() => {
        const child = expectedRecord.child;
        const name = child.name;

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

      browser.search('', name.surname, name.givenName, child.dateOfBirth);
      browser.clickFirstRecord();
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

      browser.search('', name.surname, name.givenName, child.dateOfBirth);
      browser.click('#newSearchLink');
    });

    urlShouldContainSearch();

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
      browser.search('', 'NotRealPersonSurname', 'NotRealPersonForename', '01/01/2010');
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

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
      browser.search('', name.surname, name.givenName, child.dateOfBirth);
      browser.clickFirstRecord();
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal(name.surname);
      browser.getValue('#forenames').should.equal(name.givenName);
      browser.getValue('#dob').should.equal(child.dateOfBirth);
    });
  });

  describe('When I select the "Back to search results link on the results page"', () => {
    it('returned me to the results page', () => {
      const child = expectedRecords.child;
      const name = child.name;

      browser.search('', name.surname, name.givenName, child.dateOfBirth);
      browser.clickFirstRecord();
      browser.click('#backToSearchResults');
      browser.getUrl().should.contain('surname=' + name.surname);
      browser.getUrl().should.contain('forenames=' + name.givenName);
      browser.shouldBeOnResultsPage();
    });
  });
});
