'use strict';

const moment = require('moment');
const expectedRecord = require('../expected-marriage-record');
const expectedRecords = require('../expected-marriage-records');

describe('Marriage search', () => {
  before(() => {
    browser.goToMarriageSearchPage();
  });

  it('returns the search page', () => {
    browser.shouldBeOnMarriageSearchPage();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      before(() => {
        browser.marriageSearch('', 'Churchil', 'Winston', '30/11/2011');
      });

      it('returns a results page', () => {
        browser.shouldBeOnMarriageResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal('No records found for Winston Churchil 30/11/2011');
      });
    });

    describe('that returns 1 record', () => {
      before(() => {
        const groom = expectedRecord.groom;

        browser.marriageSearch('', groom.surname, groom.forenames, expectedRecord.dateOfMarriage);
      });

      it('redirects to a details page', () => {
        browser.shouldBeOnMarriageDetailsPage();
      });
    });

    describe('that returns more than 1 record', () => {
      const groom = expectedRecords.groom;

      before(() => {
        browser.marriageSearch('', groom.surname, groom.forenames, expectedRecord.dateOfMarriage);
      });

      it('returns a results page', () => {
        browser.shouldBeOnMarriageResultsPage();
      });

      it('displays an appropriate message', () => {
        const h1 = `3 records found for ${groom.forenames} ${groom.surname} ${expectedRecord.dateOfMarriage}`;
        browser.getText('h1').should.equal(h1);
      });

      it('displays a subset of each record in a list', () => {
        const browserText = browser.getText('#records li tr');
        const dom = expectedRecords.dateOfMarriage;
        const pom = expectedRecords.placeOfMarriage.short;

        browserText[0].should.match(new RegExp('Date of marriage ?' + dom));
        browserText[1].should.match(new RegExp('Place of marriage ?' + pom));
        browserText[2].should.match(new RegExp('Date of marriage ?' + dom));
        browserText[3].should.match(new RegExp('Place of marriage ?' + pom));
        browserText[4].should.match(new RegExp('Date of marriage ?' + dom));
        browserText[5].should.match(new RegExp('Place of marriage ?' + pom));
      });

      it('contains a link back to the search screen', () => {
        browser.getText('body').should.contain('Edit search');
      });
    });

    describe('using the "fast entry" date format', () => {
      const groom = expectedRecords.groom;
      const dod = expectedRecords.dateOfMarriage.replace(/\//g, '');

      before(() => {
        browser.marriageSearch('', groom.surname, groom.forenames, dod);
      });

      it('returns a results page', () => {
        browser.shouldBeOnMarriageResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal(
          '3 records found for '
            + groom.forenames
            + ' '
            + groom.surname
            + ' '
            + dod);
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        browser.marriageSearch('', '', '', '');
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

      it('requests a date of marriage', () => {
        browser.getText('a').should.contain('Please enter a date of marriage');
      });
    });

    describe('with a system number', () => {
      describe('containing invalid characters', () => {
        before(() => {
          browser.marriageSearch('invalid', '', '', '');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a number', () => {
          browser.getText('a').should.contain('Please enter a number');
        });

        it('shows the system number details hint', () => browser.isVisible('details > div').should.be.true);
      });

      describe('of an invalid length', () => {
        before(() => {
          browser.marriageSearch('12345678', '', '', '');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a number of the valid length', () => {
          browser.getText('a').should.contain('The system number should be 9 digits');
        });

        it('shows the system number details hint', () => browser.isVisible('details > div').should.be.true);
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
          browser.marriageSearch('', 'Churchill', 'Winston', 'invalid');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a British formatted date', () => {
          browser.getText('a').should.contain('Please enter a date of marriage in the correct format');
        });

        it('the surname field should be focused (as that comes before forenames)', () =>
          browser.shouldBeFocusedOnField('input[name="dom"]'));
      });

      describe('a date in the future', () => {
        before(() => {
          browser.marriageSearch('', 'Churchill', 'Winston', moment().add(1, 'day').format('DD/MM/YYYY'));
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a past date', () => {
          browser.getText('a').should.contain('Please enter a date of marriage in the past');
        });
      });
    });

    describe('with an invalid short date that is', () => {
      describe('too short', () => {
        before(() => {
          browser.marriageSearch('', 'Churchill', 'Winston', '112001');
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a British formatted date', () => {
          browser.getText('a').should.contain('Please enter a date of marriage in the correct format');
        });
      });

      describe('a date in the future', () => {
        before(() => {
          browser.marriageSearch('', 'Churchill', 'Winston', moment().add(1, 'day').format('DDMMYYYY'));
        });

        it('displays an error message', () => {
          browser.getText('h2').should.contain('Fix the following error');
        });

        it('requests a past date', () => {
          browser.getText('a').should.contain('Please enter a date of marriage in the past');
        });
      });
    });
  });
});
