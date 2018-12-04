'use strict';

var expectedRecord = require('../expected-marriage-record');
var expectedRecords = require('../expected-marriage-records');

describe('Marriage details page', () => {
  /* eslint-disable no-unused-vars */
  const urlShouldContainDetails = () => it('returns a details page', () => browser.shouldBeOnMarriageDetailsPage());

  const urlShouldContainSearch = () => it('returns the search page', () => browser.shouldBeOnMarriageSearchPage());

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      const h1 = new RegExp(`${recordToMatch.bride.forenames}.* ${recordToMatch.bride.surname}`
                            + ' & '
                            + `${recordToMatch.groom.forenames}.* ${recordToMatch.groom.surname}`);
      browser.getText('h1').should.match(h1);
    });
  };

  const recordDisplayed = (record) => {
    it('the complete record is displayed in a table', () => {
      const browserText = browser.$$('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].getText().should.match(new RegExp('System number *' + record.id));
      browserText[1].getText().should.match(new RegExp('Date of marriage *' + record.dateOfMarriage));
      browserText[2].getText().should.match(new RegExp('Place of marriage *' + record.placeOfMarriage));
      browserText[4].getText().should.match(new RegExp('Surname *' + record.groom.surname));
      browserText[5].getText().should.match(new RegExp('Forename\\(s\\) *' + record.groom.forenames));
      browserText[6].getText().should.match(new RegExp('Age *' + record.groom.age));
      browserText[7].getText().should.match(new RegExp('Occupation *' + record.groom.occupation));
      browserText[8].getText().should.match(new RegExp('Address *' + record.groom.address));
      browserText[9].getText().should.match(new RegExp('Condition *' + record.groom.condition));
      browserText[10].getText().should.match(new RegExp('Signature *' + record.groom.signature));
      browserText[12].getText().should.match(new RegExp('Surname *' + record.bride.surname));
      browserText[13].getText().should.match(new RegExp('Forename\\(s\\) *' + record.bride.forenames));
      browserText[14].getText().should.match(new RegExp('Age *' + record.bride.age));
      browserText[15].getText().should.match(new RegExp('Occupation *' + record.bride.occupation));
      browserText[16].getText().should.match(new RegExp('Address *' + record.bride.address));
      browserText[17].getText().should.match(new RegExp('Condition *' + record.bride.condition));
      browserText[18].getText().should.match(new RegExp('Signature *' + record.bride.signature));
      browserText[20].getText().should.match(new RegExp('Surname *' + record.fatherOfGroom.surname));
      browserText[21].getText().should.match(new RegExp('Forename\\(s\\) *' + record.fatherOfGroom.forenames));
      browserText[22].getText().should.match(new RegExp('Occupation *' + record.fatherOfGroom.occupation));
      browserText[24].getText().should.match(new RegExp('Surname *' + record.fatherOfBride.surname));
      browserText[25].getText().should.match(new RegExp('Forename\\(s\\) *' + record.fatherOfBride.forenames));
      browserText[26].getText().should.match(new RegExp('Occupation *' + record.fatherOfBride.occupation));
      browserText[28].getText().should.match(new RegExp('Signature *' + record.witness1.signature));
      browserText[30].getText().should.match(new RegExp('Signature *' + record.witness2.signature));
      browserText[32].getText().should.match(new RegExp('Registrar signature *' + record.registrar.signature));
      browserText[33].getText().should.match(new RegExp('Registrar designation *' + record.registrar.designation));
      browserText[34].getText().should.match(new RegExp(
        'Superintendent registrar signature *' + record.registrar.superintendentSignature));
      browserText[35].getText().should.match(new RegExp(
        'Superintendent registrar designation *' + record.registrar.superintendentDesignation));
      browserText[36].getText().should.match(new RegExp('District *' + record.registrar.district));
      browserText[37].getText().should.match(new RegExp('Administrative area *' + record.registrar.administrativeArea));
      browserText[38].getText().should.match(new RegExp('Date of registration *' + record.date));
      browserText[39].getText().should.match(new RegExp('Entry number *' + record.entryNumber));
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
        const groom = expectedRecord.groom;

        browser.marriageSearch('', groom.surname, groom.forenames, expectedRecord.dateOfMarriage);
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecord);
    recordDisplayed(expectedRecord);
    editSearchDisplayed();
    backToSearchResultsNotDisplayed();
  });

  describe('When there is more than one result', () => {

    before(() => {
      const groom = expectedRecords.groom;

      browser.marriageSearch('', groom.surname, groom.forenames, expectedRecords.dateOfMarriage);
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
      const groom = expectedRecord.groom;

      browser.marriageSearch('', groom.surname, groom.forenames, expectedRecord.dateOfMarriage);
      browser.click('#newSearchLink');
    });

    urlShouldContainSearch();

    it('has empty form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('');
      browser.getValue('#forenames').should.equal('');
      browser.getValue('#dom').should.equal('');
    });
  });

  describe('When I select the "Edit search" link on the results page', () => {
    before(() => {
      browser.marriageSearch('', 'NotRealPersonSurname', 'NotRealPersonForename', '01/01/2010');
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('NotRealPersonSurname');
      browser.getValue('#forenames').should.equal('NotRealPersonForename');
      browser.getValue('#dom').should.equal('01/01/2010');
    });
  });

  describe('When I select the "Edit search" link on the details page', () => {
    const groom = expectedRecords.groom;

    before(() => {
      browser.marriageSearch('', groom.surname, groom.forenames, expectedRecords.dateOfMarriage);
      browser.clickFirstRecord();
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal(groom.surname);
      browser.getValue('#forenames').should.equal(groom.forenames);
      browser.getValue('#dom').should.equal(expectedRecords.dateOfMarriage);
    });
  });

  describe('When I select the "Back to search results link on the results page"', () => {
    it('returned me to the results page', () => {
      const groom = expectedRecords.groom;

      browser.marriageSearch('', groom.surname, groom.forenames, expectedRecords.dateOfMarriage);
      browser.clickFirstRecord();
      browser.click('#backToSearchResults');
      browser.getUrl().should.contain('surname=' + groom.surname.replace(/ /g, '+'));
      browser.getUrl().should.contain('forenames=' + groom.forenames.replace(/ /g, '+'));
      browser.shouldBeOnResultsPage();
    });
  });
});
