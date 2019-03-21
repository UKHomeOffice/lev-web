'use strict';

const expectedRecord = require('../expected-partnership-record');
const expectedRecords = require('../expected-partnership-records');
const role = require('../../../config').fullDetailsRoleName;
const testConfig = require('../config');

describe('Partnership details page', () => {
  /* eslint-disable no-unused-vars */
  const urlShouldContainDetails = () => it('returns a details page', () => browser.shouldBeOnPartnershipDetailsPage());

  const urlShouldContainSearch = () => it('returns the search page', () => browser.shouldBeOnPartnershipSearchPage());

  const messageDisplayed = (recordToMatch) => {
    it('an appropriate message is displayed', () => {
      const h1 = new RegExp(`${recordToMatch.partner2.forenames}.* ${recordToMatch.partner2.surname}`
                            + ' & '
                            + `${recordToMatch.partner1.forenames}.* ${recordToMatch.partner1.surname}`);
      browser.getText('h1').should.match(h1);
    });
  };

  const recordDisplayed = (record) => {
    it('a limited version is displayed in a table', () => {
      const rowTexts = browser.$$('table tr');
      const tableText = browser.$('table').getText();
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      rowTexts[0].getText().should.match(new RegExp('System number *' + record.id));
      rowTexts[1].getText().should.match(new RegExp('Date of partnership *' + record.dateOfPartnership));
      rowTexts[2].getText().should.match(new RegExp('Place of partnership *' + record.placeOfPartnership.address));
      rowTexts[4].getText().should.match(new RegExp('Surname *' + record.partner1.surname));
      rowTexts[5].getText().should.match(new RegExp('Forename\\(s\\) *' + record.partner1.forenames));
      tableText.should.not.match(new RegExp('Age *' + record.partner1.age));
      tableText.should.not.match(new RegExp('Occupation *' + record.partner1.occupation));
      rowTexts[6].getText().should.match(new RegExp('Address *' + record.partner1.address));
      tableText.should.not.match(new RegExp('Condition *' + record.partner1.condition));
      tableText.should.not.match(new RegExp('Signature *' + record.partner1.signature));
      rowTexts[8].getText().should.match(new RegExp('Surname *' + record.partner2.surname));
      rowTexts[9].getText().should.match(new RegExp('Forename\\(s\\) *' + record.partner2.forenames));
      tableText.should.not.match(new RegExp('Age *' + record.partner2.age));
      tableText.should.not.match(new RegExp('Occupation *' + record.partner2.occupation));
      rowTexts[10].getText().should.match(new RegExp('Address *' + record.partner2.address));
      tableText.should.not.match(new RegExp('Condition *' + record.partner2.condition));
      tableText.should.not.match(new RegExp('Signature *' + record.partner2.signature));
      tableText.should.not.match(new RegExp('Surname *' + record.fatherOfPartner1.surname));
      tableText.should.not.match(new RegExp(`Forename\\(s\\) *${record.fatherOfPartner1.forenames} *Occupation`));
      tableText.should.not.match(new RegExp('Occupation *' + record.fatherOfPartner1.occupation));
      tableText.should.not.match(new RegExp('Designation *' + record.fatherOfPartner1.designation));
      tableText.should.not.match(new RegExp('Bride\s*Surname *' + record.fatherOfPartner2.surname));
      tableText.should.not.match(new RegExp('Forename\\(s\\) *' + record.fatherOfPartner2.forenames));
      tableText.should.not.match(new RegExp('Occupation *' + record.fatherOfPartner2.occupation));
      tableText.should.not.match(new RegExp('Designation *' + record.fatherOfPartner2.designation));
      tableText.should.not.match(new RegExp('Signature *' + record.witness1.signature));
      tableText.should.not.match(new RegExp('Signature *' + record.witness2.signature));
      tableText.should.not.match(new RegExp('Registrar signature *' + record.registrar.signature));
      tableText.should.not.match(new RegExp('Registrar designation *' + record.registrar.designation));
      rowTexts[12].getText().should.match(new RegExp('Date of registration *' + record.date));
    });
  };

  const fullRecordDisplayed = (record) => {
    it('the complete record is displayed in a table', () => { // eslint-disable-line complexity
      const browserText = browser.$$('table tr');
      // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
      browserText[0].getText().should.match(new RegExp('System number *' + record.id));
      browserText[1].getText().should.match(new RegExp('Date of partnership *' + record.dateOfPartnership));
      browserText[2].getText().should.match(new RegExp('Place of partnership *' + record.placeOfPartnership.address));
      browserText[4].getText().should.match(new RegExp('Surname *' + record.partner1.surname));
      browserText[5].getText().should.match(new RegExp('Forename\\(s\\) *' + record.partner1.forenames));
      browserText[6].getText().should.match(new RegExp('Date of birth *' + record.partner1.dob));
      browserText[7].getText().should.match(new RegExp(
        'Occupation *' + record.partner1.occupation + (record.partner1.retired ? ' *\\(retired\\)' : '')));
      browserText[8].getText().should.match(new RegExp('Address *' + record.partner1.address));
      browserText[9].getText().should.match(new RegExp('Condition *' + record.partner1.condition));
      browserText[10].getText().should.match(new RegExp('Signature *' + record.partner1.signature));
      browserText[12].getText().should.match(new RegExp('Surname *' + record.partner2.surname));
      browserText[13].getText().should.match(new RegExp('Forename\\(s\\) *' + record.partner2.forenames));
      browserText[14].getText().should.match(new RegExp('Date of birth *' + record.partner2.dob));
      browserText[15].getText().should.match(new RegExp(
        'Occupation *' + record.partner2.occupation + (record.partner2.retired ? ' *\\(retired\\)' : '')));
      browserText[16].getText().should.match(new RegExp('Address *' + record.partner2.address));
      browserText[17].getText().should.match(new RegExp('Condition *' + record.partner2.condition));
      browserText[18].getText().should.match(new RegExp('Signature *' + record.partner2.signature));
      browserText[20].getText().should.match(new RegExp('Surname *' + record.fatherOfPartner1.surname));
      browserText[21].getText().should.match(new RegExp('Forename\\(s\\) *' + record.fatherOfPartner1.forenames));
      browserText[22].getText().should.match(new RegExp('Occupation *' +
        record.fatherOfPartner1.occupation + (record.fatherOfPartner1.retired ? ' *\\(retired\\)' : '')));
      browserText[23].getText().should.match(new RegExp('Designation *' + (record.fatherOfPartner1.designation || '')));
      browserText[24].getText().should.match(new RegExp(
        'Deceased *' + (record.fatherOfPartner1.deceased ? 'Yes' : 'No')));
      browserText[26].getText().should.match(new RegExp('Surname *' + record.motherOfPartner1.surname));
      browserText[27].getText().should.match(new RegExp('Forename\\(s\\) *' + record.motherOfPartner1.forenames));
      browserText[28].getText().should.match(new RegExp('Occupation *' +
        record.motherOfPartner1.occupation + (record.motherOfPartner1.retired ? ' *\\(retired\\)' : '')));
      browserText[29].getText().should.match(new RegExp('Designation *' + (record.motherOfPartner1.designation || '')));
      browserText[30].getText().should.match(new RegExp(
        'Deceased *' + (record.motherOfPartner1.deceased ? 'Yes' : 'No')));
      browserText[32].getText().should.match(new RegExp('Surname *' + record.fatherOfPartner2.surname));
      browserText[33].getText().should.match(new RegExp('Forename\\(s\\) *' + record.fatherOfPartner2.forenames));
      browserText[34].getText().should.match(new RegExp('Occupation *' +
        record.fatherOfPartner2.occupation + (record.fatherOfPartner2.retired ? ' *\\(retired\\)' : '')));
      browserText[35].getText().should.match(new RegExp('Designation *' + (record.fatherOfPartner2.designation || '')));
      browserText[36].getText().should.match(new RegExp(
        'Deceased *' + (record.fatherOfPartner2.deceased ? 'Yes' : 'No')));
      browserText[38].getText().should.match(new RegExp('Surname *' + record.motherOfPartner2.surname));
      browserText[39].getText().should.match(new RegExp('Forename\\(s\\) *' + record.motherOfPartner2.forenames));
      browserText[40].getText().should.match(new RegExp('Occupation *' +
        record.motherOfPartner2.occupation + (record.motherOfPartner2.retired ? ' *\\(retired\\)' : '')));
      browserText[41].getText().should.match(new RegExp('Designation *' + (record.motherOfPartner2.designation || '')));
      browserText[42].getText().should.match(new RegExp(
        'Deceased *' + (record.motherOfPartner2.deceased ? 'Yes' : 'No')));
      browserText[44].getText().should.match(new RegExp(
        `Signature *${record.witness1.forename} ${record.witness1.surname}`));
      browserText[46].getText().should.match(new RegExp(
        `Signature *${record.witness2.forename} ${record.witness2.surname}`));
      browserText[48].getText().should.match(new RegExp('Registrar signature *' + record.registrar.signature));
      browserText[49].getText().should.match(new RegExp('Date of registration *' + record.date));
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
        const prtnr1 = expectedRecord.partner1;

        browser.partnershipSearch('', prtnr1.surname, prtnr1.forenames, expectedRecord.dateOfPartnership);
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

  const partner1 = expectedRecords.partner1;
  const forename = partner1.forenames.split(' ')[0];

  describe('When there is more than one result', () => {
    before(() => {
      browser.partnershipSearch('', partner1.surname, forename, expectedRecords.dateOfPartnership);
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
      browser.partnershipSearch('', partner1.surname, forename, expectedRecord.dateOfPartnership);
      browser.click('#newSearchLink');
    });

    urlShouldContainSearch();

    it('has empty form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('');
      browser.getValue('#forenames').should.equal('');
      browser.getValue('#dop').should.equal('');
    });
  });

  describe('When I select the "Edit search" link on the results page', () => {
    before(() => {
      browser.partnershipSearch('', 'NotRealPersonSurname', 'NotRealPersonForename', '01/01/2010');
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal('NotRealPersonSurname');
      browser.getValue('#forenames').should.equal('NotRealPersonForename');
      browser.getValue('#dop').should.equal('01/01/2010');
    });
  });

  describe('When I select the "Edit search" link on the details page', () => {
    before(() => {
      browser.partnershipSearch('', partner1.surname, forename, expectedRecords.dateOfPartnership);
      browser.clickFirstRecord();
      browser.click('#editSearchLink');
    });

    urlShouldContainSearch();

    it('has the correct form values', () => {
      browser.waitForVisible('input[name="forenames"]', 5000);
      browser.getValue('#system-number').should.equal('');
      browser.getValue('#surname').should.equal(partner1.surname);
      browser.getValue('#forenames').should.equal(forename);
      browser.getValue('#dop').should.equal(expectedRecords.dateOfPartnership);
    });
  });

  describe('When I select the "Back to search results link on the results page"', () => {
    it('returned me to the results page', () => {
      browser.partnershipSearch('', partner1.surname, forename, expectedRecords.dateOfPartnership);
      browser.clickFirstRecord();
      browser.click('#backToSearchResults');
      browser.getUrl().should.contain('surname=' + partner1.surname.replace(/ /g, '+'));
      browser.getUrl().should.contain('forenames=' + forename.replace(/ /g, '+'));
      browser.shouldBeOnResultsPage();
    });
  });
});
