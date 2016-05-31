'use strict';

const url = require('../config').url;

module.exports = (target) => {
  target.search = function (systemNumber, surname, forenames, dob) {
    this.goToSearchPage();
    this.submitSearchPage(systemNumber, surname, forenames, dob);
  };

  target.goToSearchPage = function () {
    this.url(url);
  };

  target.shouldBeOnSearchPage = function () {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from birth certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.equal('Date of birth');
  };

  target.submitSearchPage = function (systemNumber, surname, forenames, dob) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dob"]', dob);
    this.submitForm('form');
  };
};
