'use strict';

describe('Details Page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001');
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
        'Father Paul Davis',
        'Place of birth Croydon',
        'Occupation Self-employed',
        'Mother Janet Smith',
        'Maiden name Alice',
        'Place of birth Manchester',
        'Occupation Engineer',
        'Birth jointly registered No',
        'Registration district Norfolk',
        'Sub-district Norwich',
        'Administrative area Norfolk',
        'Date of registration 25/09/1976'
      ]);

  });

});
