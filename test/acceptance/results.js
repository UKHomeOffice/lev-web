'use strict';

describe('Results page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001');
  });

  describe('When there are no results', function () {

    beforeEach(function () {
      browser.setValue('input[name="system-number"]', '123456');
      browser.setValue('input[name="surname"]', 'Churchil')
      browser.setValue('input[name="forenames"]', 'Winston')
      browser.setValue('input[name="dob"]', '30/11/1874');
      browser.submitForm('form');
    });

    it('redirects to the results page', function () {
      browser.getUrl().should.contain('/results');
    });

    it('displays an appropriate message', function () {
      browser.getText('h1').should.equal('No records found for 123456 Winston Churchil 30/11/1874');
    });

  });

  describe('When there is more than one result', function () {

    beforeEach(function () {
        browser.setValue('input[name="surname"]', 'Smith')
        browser.setValue('input[name="forenames"]', 'John')
        browser.submitForm('form');
      });

      it('redirects to the results page', function () {
        browser.getUrl().should.contain('/results');
      });

      it('displays an appropriate message', function () {
        browser.getText('h1').should.equal('3 records found for John Smith');
      });

      it('displays a subset of each record in a list', function () {
        browser.getText('#records li:first-child tr')
          .should.deep.equal([
            'Place of birth Oxford',
            'Father Robert Adam Smith',
            'Mother Anne Catherine Smith'
          ]);

        browser.getText('#records li:last-child tr')
          .should.deep.equal([
            'Place of birth Tonbridge',
            'Father Alan Monk',
            'Mother Pauline Smith'
          ]);

      });

  });

});
