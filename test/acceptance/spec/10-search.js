'use strict';

const mockProxy = require('../mock-proxy');
const expectedRecord = require('../expectedRecord');
const expectedRecords = require('../expectedRecords');

describe('Search', () => {
  before(() => {
    browser.goToSearchPage();
  });

  it('returns the search page', () => {
    browser.shouldBeOnSearchPage();
  });

  describe('submitting a valid query', () => {
    describe('that returns no records', () => {
      before(() => {
        mockProxy.willReturnForLocalTests(0);
        browser.search('', 'Churchil', 'Winston', '30/11/1874');
      });

      it('returns a results page', () => {
        browser.shouldBeOnResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal('No records found for Winston Churchil 30/11/1874');
      });
    });

    describe('that returns 1 record', () => {
      before(() => {
        const child = expectedRecord.child;
        const name = child.originalName;

        mockProxy.willReturnForLocalTests(1);
        browser.search('', name.surname, name.givenName, child.dateOfBirth);
      });

      it('redirects to a details page', () => {
        browser.shouldBeOnDetailsPage();
      });
    });

    describe('that returns more than 1 record', () => {
      before(() => {
        const child = expectedRecords.child;
        const name = child.originalName;

        mockProxy.willReturnForLocalTests(3);
        browser.search('', name.surname, name.givenName, '');
      });

      it('returns a results page', () => {
        browser.shouldBeOnResultsPage();
      });

      it('displays an appropriate message', () => {
        browser.getText('h1').should.equal('3 records found for Tester Solo');
      });

      it('displays a subset of each record in a list', () => {
        const browserText = browser.getText('#records li tr');
        const birthplace = expectedRecords.child.birthplace;
        const fatherName = expectedRecords.father.name;
        const motherName = expectedRecords.mother.name;
        // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
        const fatherNameRegex = fatherName.givenName.split(' ')[0] + '.*' + fatherName.surname;
        const motherNameRegex = motherName.givenName.split(' ')[0] + '.*' + motherName.surname;

        browserText[0].should.match(new RegExp('Place of birth ?' + birthplace));
        browserText[1].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[2].should.match(new RegExp('Mother ?' + motherNameRegex));
        browserText[3].should.match(new RegExp('Place of birth ?' + birthplace));
        browserText[4].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[5].should.match(new RegExp('Mother ?' + motherNameRegex));
        browserText[6].should.match(new RegExp('Place of birth ?' + birthplace));
        browserText[7].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[8].should.match(new RegExp('Mother ?' + motherNameRegex));
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        browser.search('', '', '', '');
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
    });

    describe('with an invalid sytem number', () => {
      before(() => {
        browser.search('invalid', '', '', '');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests an integer', () => {
        browser.getText('a').should.contain('Please enter an integer');
      });
    });

    describe('with an invalid date', () => {
      before(() => {
        browser.search('', 'Churchill', 'Winston', 'invalid');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a British formatted date', () => {
        browser.getText('a').should.contain('Please enter a date of birth in the correct format');
      });
    });
  });
});
