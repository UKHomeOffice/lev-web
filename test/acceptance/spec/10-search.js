'use strict';

var mockProxy = require('../mock-proxy');
var expectedRecord = require('../expectedRecord');
var expectedRecords = require('../expectedRecords');
var testConfig = require('../config');

describe('Search Page', function() {
  beforeEach(function () {
    browser.url(testConfig.url);
  });

  describe('the form', function () {
    it('has a title', function () {
      browser.getText('h1').should.equal('Applicant\'s details');
    });

    it('has the correct form elements', function () {
      browser.waitForVisible('input[name="system-number"]', 5000);
      var formLabels = browser.getText('label');
      formLabels[0].should.equal('System number from birth certificate');
      formLabels[1].should.equal('Surname');
      formLabels[2].should.equal('Forename(s)');
      formLabels[3].should.equal('Date of birth');
    });
  });

  describe('submitting a valid query', function () {
    beforeEach(function () {
      browser.setValue('input[name="surname"]', 'Churchill');
      browser.setValue('input[name="forenames"]', 'Winston');
      browser.setValue('input[name="dob"]', '30/11/1874');
    });

    describe('that returns no records', function () {
      beforeEach(function () {
        mockProxy.willReturnForLocalTests(0);
        browser.submitForm('form');
      });

      it('displays an appropriate message', function () {
        browser.getText('h1').should.equal('No records found for Winston Churchill 30/11/1874');
      });
    });

    describe('that returns 1 record', function () {
      beforeEach(function () {
        mockProxy.willReturnForLocalTests(1);
        browser.submitForm('form');
      });

      it('the url should contain /details', function () {
        browser.getUrl().should.contain('/details');
      });
    });

    describe('that returns more than 1 record', function () {
      beforeEach(function () {
        mockProxy.willReturnForLocalTests(3);
        browser.submitForm('form');
      });

      it('displays an appropriate message', function () {
        browser.getText('h1').should.equal('3 records found for Winston Churchill 30/11/1874');
      });

      it('displays a subset of each record in a list', function () {
        var browserText = browser.getText('#records li tr');
        // Regexes used here as htmlunit and chrome differ in showing space so need regex to work with both
        var fatherNameRegex = expectedRecords.father.name.givenName.split(' ')[0] + '.*' +
          expectedRecords.father.name.surname;
        var motherNameRegex = expectedRecords.mother.name.givenName.split(' ')[0] + '.*' +
          expectedRecords.mother.name.surname;
        browserText[0].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
        browserText[1].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[2].should.match(new RegExp('Mother ?' + motherNameRegex));
        browserText[3].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
        browserText[4].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[5].should.match(new RegExp('Mother ?' + motherNameRegex));
        browserText[6].should.match(new RegExp('Place of birth ?' + expectedRecords.child.birthplace));
        browserText[7].should.match(new RegExp('Father ?' + fatherNameRegex));
        browserText[8].should.match(new RegExp('Mother ?' + motherNameRegex));
      });
    });
  });

  describe('submitting an invalid query', function () {
    describe('with all fields empty', function () {
      beforeEach(function () {
        browser.submitForm('form');
      });

      it('displays an error message', function () {
        browser.getText('h2').should.contain('Fix the following error');
        browser.getText('a').should.contain('Please enter a surname');
        browser.getText('a').should.contain('Please enter at least one forename');
        browser.getText('a').should.contain('Please enter a date of birth');
      });
    });

    describe('with an invalid sytem number', function () {
      beforeEach(function () {
        browser.setValue('input[name="system-number"]', 'invalid');
        browser.submitForm('form');
      });

      it('displays an error message', function () {
        browser.getText('h2').should.contain('Fix the following error');
        browser.getText('a').should.contain('Please enter an integer');
      });
    });

    describe('with an invalid date', function () {
      beforeEach(function () {
        browser.setValue('input[name="surname"]', 'Churchill');
        browser.setValue('input[name="dob"]', 'invalid');
        browser.submitForm('form');
      });

      it('displays an error message', function () {
        browser.getText('h2').should.contain('Fix the following error');
        browser.getText('a').should.contain('Please enter a date of birth in the correct format');
      });
    });
  });
});
