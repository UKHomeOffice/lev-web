'use strict';

const moment = require('moment');
const expectedRecord = require('../expected-partnership-record');
const expectedRecords = require('../expected-partnership-records');

describe('Partnership search', () => {
  before(() => {
    browser.goToPartnershipSearchPage();
  });

  it('returns the search page', () => {
    browser.shouldBeOnPartnershipSearchPage();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      before(() => {
        browser.partnershipSearch('', 'Churchil', 'Winston', '30/11/2011');
      });

      it('returns a results page', () => {
        browser.shouldBeOnPartnershipResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal('No records found for Winston Churchil 30/11/2011');
      });
    });

    describe('that returns 1 record', () => {
      const partner1 = expectedRecord.partner1;
      const forename = partner1.forenames.split(' ')[0];

      before(() => {
        browser.partnershipSearch('', partner1.surname, forename, expectedRecord.dateOfPartnership);
      });

      it('redirects to a details page', () => {
        browser.shouldBeOnPartnershipDetailsPage();
      });
    });

    describe('that returns more than 1 record', () => {
      const partner1 = expectedRecords.partner1;
      const forename = partner1.forenames.split(' ')[0];

      before(() => {
        browser.partnershipSearch('', partner1.surname, forename, expectedRecords.dateOfPartnership);
      });

      it('returns a results page', () => {
        browser.shouldBeOnPartnershipResultsPage();
      });

      it('displays an appropriate message', () => {
        const h1 = `3 records found for ${forename} ${partner1.surname} ${expectedRecords.dateOfPartnership}`;
        browser.getText('h1').should.equal(h1);
      });

      it('displays a subset of each record in a list', () => {
        const browserText = browser.getText('#records li tr');
        const dop = expectedRecords.dateOfPartnership;
        const pop = expectedRecords.placeOfPartnership.short;

        browserText[0].should.match(new RegExp('Date of partnership ?' + dop));
        browserText[1].should.match(new RegExp('Place of partnership ?' + pop));
        browserText[2].should.match(new RegExp('Date of partnership ?' + dop));
        browserText[3].should.match(new RegExp('Place of partnership ?' + pop));
        browserText[4].should.match(new RegExp('Date of partnership ?' + dop));
        browserText[5].should.match(new RegExp('Place of partnership ?' + pop));
      });

      it('contains a link back to the search screen', () => {
        browser.getText('body').should.contain('Edit search');
      });
    });

    describe('using the "fast entry" date format', () => {
      const dop = expectedRecords.dateOfPartnership.replace(/\//g, '');
      const partner1 = expectedRecords.partner1;
      const forename = partner1.forenames.split(' ')[0];

      before(() => {
        browser.partnershipSearch('', partner1.surname, forename, dop);
      });

      it('returns a results page', () => {
        browser.shouldBeOnPartnershipResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal(`3 records found for ${forename} ${partner1.surname} ${dop}`);
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        browser.partnershipSearch('', '', '', '');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a surname', () => {
        browser.getText('a').should.contain('Please enter a surname');
      });

      it('requests a forename', () => {
        browser.getText('a').should.contain('Please enter at least one forename');
      });

      it('requests a date of partnership', () => {
        browser.getText('a').should.contain('Please enter a date of partnership');
      });
    });

    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          browser.partnershipSearch('invalid', '', '', '');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a number', () => {
          browser.getText('a').should.contain('Please enter a number');
        });

        it('shows the system number details hint', () => browser.hintShowing('#system-number-hint'));
      });

      describe('of an invalid length', () => {
        before(() => {
          browser.partnershipSearch('12345678', '', '', '');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a number of the valid length', () => {
          browser.getText('a').should.contain('The system number should be 9 digits');
        });

        it('shows the system number details hint', () => browser.hintShowing('#system-number-hint'));
      });
    });

    describe('with a missing first name', () => {
      before(() => browser.search('', 'Surname', '', '5/6/2010'));

      it('displays an error message', () => browser.getText('h2').should.contain('Fix the following error'));

      it('requests the first name field be filled-out', () =>
        browser.getText('a').should.contain('Please enter at least one forename'));

      it('the forenames field should be focused', () =>
        browser.shouldBeFocusedOnField('input[name="forenames"]'));

      describe('and a missing surname', () => {
        before(() => browser.search('', '', '', '', '5/6/2010'));

        it('displays an error message', () => browser.getText('h2').should.contain('Fix the following error'));

        it('requests the surname field be filled-out', () =>
          browser.getText('a').should.contain('Please enter a surname'));

        it('requests the first name field be filled-out', () =>
          browser.getText('a').should.contain('Please enter at least one forename'));

        it('the forenames field should be focused', () =>
          browser.shouldBeFocusedOnField('input[name="surname"]'));
      });
    });

    describe('with an invalid date that is', () => {
      describe('not a date', () => {
        before(() => {
          browser.partnershipSearch('', 'Churchill', 'Winston', 'invalid');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a British formatted date', () => {
          browser.getText('a').should.contain('Please enter a date of partnership in the correct format');
        });

        it('shows the date of birth details hint', () => browser.hintShowing('#dop-extended-hint'));

        it('the surname field should be focused (as that comes before forenames)', () =>
          browser.shouldBeFocusedOnField('input[name="dop"]'));
      });

      describe('a date in the future', () => {
        before(() => {
          browser.partnershipSearch('', 'Churchill', 'Winston', moment().add(1, 'day').format('DD/MM/YYYY'));
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a past date', () => {
          browser.getText('a').should.contain('Please enter a date of partnership in the past');
        });

        it('shows the date of birth details hint', () => browser.hintShowing('#dop-extended-hint'));
      });
    });

    describe('with an invalid short date that is', () => {
      describe('too short', () => {
        before(() => {
          browser.partnershipSearch('', 'Churchill', 'Winston', '112001');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a British formatted date', () => {
          browser.getText('a').should.contain('Please enter a date of partnership in the correct format');
        });

        it('shows the date of birth details hint', () => browser.hintShowing('#dop-extended-hint'));
      });

      describe('a date in the future', () => {
        before(() => {
          browser.partnershipSearch('', 'Churchill', 'Winston', moment().add(1, 'day').format('DDMMYYYY'));
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a past date', () => {
          browser.getText('a').should.contain('Please enter a date of partnership in the past');
        });

        it('shows the date of birth details hint', () => browser.hintShowing('#dop-extended-hint'));
      });
    });
  });
});
