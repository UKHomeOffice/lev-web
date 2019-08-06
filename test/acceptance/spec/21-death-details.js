'use strict';

const expectedRecord = require('../expected-death-record');
const expectedRecords = require('../expected-death-records');
const role = require('../../../config').fullDetailsRoleName;
const testConfig = require('../config');

describe('Death details page', () => {
  /* eslint-disable no-unused-vars */
  const urlShouldContainDetails = () => it('returns a details page', () => browser.shouldBeOnDeathDetailsPage());

  const urlShouldContainSearch = () => it('returns the search page', () => browser.shouldBeOnDeathSearchPage());

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      const d = recordToMatch.deceased;
      const h1 = new RegExp(`^${d.forenames}.* ${d.surname} ${d.dateOfBirth}\$`);
      browser.getText('h1').should.match(h1);
    });
  };

  const recordDisplayed = (record) => {
    it('a limited version is displayed in a table', () => {
      const browserText = browser.$$('table tr');
      const tableText = browser.$('table').getText();
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].getText().should.match(new RegExp('System number *' + record.id));
      browserText[2].getText().should.match(new RegExp(
        'Name *' + record.deceased.forenames + '.*' + record.deceased.surname));
      tableText.should.not.match(new RegExp('Maiden name *' + record.deceased.maidenSurname));
      browserText[3].getText().should.match(new RegExp('Date of birth *' + record.deceased.dateOfBirth));
      tableText.should.not.match(new RegExp('Place of birth *' + record.deceased.birthplace));
      browserText[4].getText().should.match(new RegExp('Sex *' + record.deceased.sex));
      browserText[5].getText().should.match(new RegExp('Address *' + record.deceased.address));
      tableText.should.not.match(new RegExp('Occupation *' + record.deceased.occupation));
      browserText[6].getText().should.match(new RegExp('Date of death *' + record.deceased.dateOfDeath));
      tableText.should.not.match(new RegExp('Place of death *' + record.deceased.deathplace));
      tableText.should.not.match(new RegExp('Age at death *' + record.deceased.ageAtDeath));
      tableText.should.not.match(new RegExp('Cause of death *' + record.deceased.causeOfDeath));
      tableText.should.not.match(new RegExp('Death certified by *' + record.deceased.certifiedBy));
      tableText.should.not.match(new RegExp('Surname *' + record.informant.surname));
      tableText.should.not.match(new RegExp('Forename\\(s\\) *' + record.informant.forenames));
      tableText.should.not.match(new RegExp('Registration.*Address *' + record.informant.address));
      tableText.should.not.match(new RegExp('Qualification *' + record.informant.qualification));
      tableText.should.not.match(new RegExp('Signature *' + record.informant.signature));
      tableText.should.not.match(new RegExp('Registrar signature *' + record.registrar.signature));
      tableText.should.not.match(new RegExp('Registrar designation *' + record.registrar.designation));
      browserText[8].getText().should.match(new RegExp('Sub-district *' + record.registrar.subdistrict));
      browserText[9].getText().should.match(new RegExp('District *' + record.registrar.district));
      browserText[10].getText().should.match(new RegExp('Administrative area *' + record.registrar.administrativeArea));
      browserText[11].getText().should.match(new RegExp('Date of registration *' + record.date));
      tableText.should.not.match(new RegExp('Entry number *' + record.entryNumber));
    });
  };

  const fullRecordDisplayed = (record) => {
    it('the complete record is displayed in a table', () => {
      const browserText = browser.$$('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].getText().should.match(new RegExp('System number *' + record.id));
      browserText[2].getText().should.match(new RegExp(
        'Name *' + record.deceased.forenames + '.*' + record.deceased.surname));
      browserText[3].getText().should.match(new RegExp('Maiden name *' + record.deceased.maidenSurname));
      browserText[4].getText().should.match(new RegExp('Date of birth *' + record.deceased.dateOfBirth));
      browserText[5].getText().should.match(new RegExp('Place of birth *' + record.deceased.birthplace));
      browserText[6].getText().should.match(new RegExp('Sex *' + record.deceased.sex));
      browserText[7].getText().should.match(new RegExp('Address *' + record.deceased.address));
      browserText[8].getText().should.match(new RegExp('Occupation *' + record.deceased.occupation));
      browserText[9].getText().should.match(new RegExp('Date of death *' + record.deceased.dateOfDeath));
      browserText[10].getText().should.match(new RegExp('Place of death *' + record.deceased.deathplace));
      browserText[11].getText().should.match(new RegExp('Age at death *' + record.deceased.ageAtDeath));
      browserText[12].getText().should.match(new RegExp('Cause of death *' + record.deceased.causeOfDeath));
      browserText[13].getText().should.match(new RegExp('Death certified by *' + record.deceased.certifiedBy));
      browserText[15].getText().should.match(new RegExp('Surname *' + record.informant.surname));
      browserText[16].getText().should.match(new RegExp('Forename\\(s\\) *' + record.informant.forenames));
      browserText[17].getText().should.match(new RegExp('Address *' + record.informant.address));
      browserText[18].getText().should.match(new RegExp('Qualification *' + record.informant.qualification));
      browserText[19].getText().should.match(new RegExp('Signature *' + record.informant.signature));
      browserText[21].getText().should.match(new RegExp('Registrar signature *' + record.registrar.signature));
      browserText[22].getText().should.match(new RegExp('Registrar designation *' + record.registrar.designation));
      browserText[23].getText().should.match(new RegExp('Sub-district *' + record.registrar.subdistrict));
      browserText[24].getText().should.match(new RegExp('District *' + record.registrar.district));
      browserText[25].getText().should.match(new RegExp('Administrative area *' + record.registrar.administrativeArea));
      browserText[26].getText().should.match(new RegExp('Date of registration *' + record.date));
      browserText[27].getText().should.match(new RegExp('Entry number *' + record.entryNumber));
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
        const deceased = expectedRecord.deceased;

        browser.deathSearch('', deceased.surname, deceased.forenames, deceased.dateOfDeath);
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecord);
    recordDisplayed(expectedRecord);
    editSearchDisplayed();
    backToSearchResultsNotDisplayed();

    (testConfig.e2e ? describe.skip : describe)('which shows the full details to select users', () => {
      // NOTE: anyone with the appropriate role should see the full info
      before(() => browser.jsRefreshWithRoles([role]));

      urlShouldContainDetails();
      messageDisplayed(expectedRecord);
      fullRecordDisplayed(expectedRecord);
      editSearchDisplayed();
      backToSearchResultsNotDisplayed();
    });
  });

  describe('When there is more than one result', () => {
    before(() => {
      const deceased = expectedRecords.deceased;

      browser.deathSearch('', deceased.surname, deceased.forenames, deceased.dateOfDeath);
      browser.clickFirstRecord();
    });

    urlShouldContainDetails();
    messageDisplayed(expectedRecords);
    recordDisplayed(expectedRecords);
    editSearchDisplayed();
    backToSearchResultsDisplayed();

    (testConfig.e2e ? describe.skip : describe)('which shows the full details to select users', () => {
      // NOTE: anyone with the appropriate role should see the full info
      before(() => browser.jsRefreshWithRoles([role]));

      urlShouldContainDetails();
      messageDisplayed(expectedRecords);
      fullRecordDisplayed(expectedRecords);
      editSearchDisplayed();
      backToSearchResultsNotDisplayed();
    });
  });

  describe('When I select the "New search" button', () => {
    before(() => {
      const deceased = expectedRecord.deceased;

      browser.deathSearch('', deceased.surname, deceased.forenames, deceased.dateOfDeath);
      browser.click('#newSearchLink');
    });

    urlShouldContainSearch();

    it('has empty form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('');
      browser.getValue('#forenames').should.equal('');
      browser.getValue('#dobd').should.equal('');
    });
  });

  describe('When I select the "Edit search" link on the results page', () => {
    before(() => {
      browser.deathSearch('', 'NotRealPersonSurname', 'NotRealPersonForename', '01/01/2010');
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('NotRealPersonSurname');
      browser.getValue('#forenames').should.equal('NotRealPersonForename');
      browser.getValue('#dobd').should.equal('01/01/2010');
    });
  });

  describe('When I select the "Edit search" link on the details page', () => {
    const deceased = expectedRecords.deceased;

    before(() => {
      browser.deathSearch('', deceased.surname, deceased.forenames, deceased.dateOfDeath);
      browser.clickFirstRecord();
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal(deceased.surname);
      browser.getValue('#forenames').should.equal(deceased.forenames);
      browser.getValue('#dobd').should.equal(deceased.dateOfDeath);
    });
  });

  describe('When I select the "Back to search results link on the results page"', () => {
    it('returned me to the results page', () => {
      const deceased = expectedRecords.deceased;

      browser.deathSearch('', deceased.surname, deceased.forenames, deceased.dateOfDeath);
      browser.clickFirstRecord();
      browser.click('#backToSearchResults');
      browser.getUrl().should.contain('surname=' + deceased.surname.replace(/ /g, '+'));
      browser.getUrl().should.contain('forenames=' + deceased.forenames.replace(/ /g, '+'));
      browser.shouldBeOnResultsPage();
    });
  });
});
