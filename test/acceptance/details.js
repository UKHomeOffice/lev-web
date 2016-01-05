'use strict';

describe('Details Page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001/search');
    browser.setValue('input[name="surname"]', 'Smith')
    browser.setValue('input[name="forenames"]', 'John Francis')
    browser.submitForm('form');
  });

  it('the url should contain /details', function () {
    browser.getUrl().should.contain('/details');
  });

  it('an appropriate message is displayed', function () {
    browser.getText('h1').should.equal('Record of John Francis Smith 23/09/1976');
  });

  it('the complete record is displayed in a table', function () {
    browser.getText('table tr')
      .should.deep.equal([
        'System number 98765',
        'Surname Smith',
        'Forename(s) John Francis',
        'Date of birth 23/09/1976',
        'Sex Male',
        'Place of birth Coltishall',
        'Mother Janet Smith',
        'Maiden name Alice',
        'Place of birth Manchester',
        'Occupation Engineer',
        'Father Paul Davis',
        'Place of birth Croydon',
        'Occupation Self-employed',
        'Birth jointly registered No',
        'Registration district Norfolk',
        'Sub-district Norwich',
        'Administrative area Norfolk',
        'Date of registration 25/09/1976'
      ]);

  });

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/search');
      browser.setValue('input[name="surname"]', 'Smith')
      browser.setValue('input[name="forenames"]', 'John Francis')
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.url('http://localhost:8001/search');
      browser.setValue('input[name="surname"]', 'Smith')
      browser.setValue('input[name="forenames"]', 'John Francis')
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
    it('has the correct form values', function () {
      browser.getValue('#content form > div:nth-child(2) > input').should.equal('Smith');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getValue('#content form > div:nth-child(3) > input').should.equal('John Francis');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
