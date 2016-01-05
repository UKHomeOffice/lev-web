'use strict';

describe('Results page @watch', function() {

  beforeEach(function () {
    browser.url('http://localhost:8001/search');
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

  describe('When I select the "New search" button', function () {
    beforeEach(function () {
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John');
      browser.submitForm('form');
      browser.click('#newSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
  });

  describe('When I select the "Edit search" link', function () {
    beforeEach(function () {
      browser.setValue('input[name="surname"]', 'Smith');
      browser.setValue('input[name="forenames"]', 'John');
      browser.submitForm('form');
      browser.click('#editSearchLink');
    });
    it('redirects to the search page', function () {
      browser.getUrl().should.contain('/search');
    });
    it('has the correct form values', function () {
      browser.getValue('#content form > div:nth-child(2) > input').should.equal('Smith');
      browser.waitForVisible('input[name="surname"]', 5000);

      browser.getValue('#content form > div:nth-child(3) > input').should.equal('John');
      browser.waitForVisible('input[name="forenames"]', 5000);
    });
  });

});
