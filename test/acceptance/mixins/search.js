'use strict';

const url = require('../config').url;

module.exports = (target) => {
  /**
   * @deprecated
   */
  target.search = function(systemNumber, surname, forenames, dob) {
    this.goToSearchPage();
    this.submitSearchPage(systemNumber, surname, forenames, dob);
  };

  target.birthSearch = function(systemNumber, surname, forenames, dob) {
    this.goToBirthSearchPage();
    this.submitBirthSearchPage(systemNumber, surname, forenames, dob);
  };

  target.deathSearch = function(systemNumber, surname, forenames, dobd) {
    this.goToDeathSearchPage();
    this.submitDeathSearchPage(systemNumber, surname, forenames, dobd);
  };

  target.marriageSearch = function(systemNumber, surname, forenames, dom) {
    this.goToMarriageSearchPage();
    this.submitMarriageSearchPage(systemNumber, surname, forenames, dom);
  };

  target.jsRefreshWithRoles = function(roles) {
    this.jsRefreshWithHeaders({ 'X-Auth-Roles': roles });
  };

  target.jsRefreshWithHeaders = function(headers) {
    this.execute((u, h) => {
      /* eslint-env browser */
      var client = new XMLHttpRequest();
      client.open('GET', u, false);
      Object.keys(h).forEach(key => client.setRequestHeader(key, h[key]));
      client.send();
      document.body.parentElement.innerHTML = client.responseText;
      /* eslint-env node, mocha */
    }, this.getUrl(), headers);
  };

  /**
   * @deprecated
   */
  target.goToSearchPage = function() {
    this.url(url);
  };

  target.goToBirthSearchPage = function() {
    this.url(url + '/birth');
  };

  target.goToDeathSearchPage = function() {
    this.url(url + '/death');
  };

  target.goToMarriageSearchPage = function() {
    this.url(url + '/marriage');
  };

  target.shouldBeOnBirthSearchPage = function() {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    this.shouldBeFocusedOnField('input[name="system-number"]');
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from birth certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.contain('Date of birth');
  };

  /**
   * @deprecated
   */
  target.shouldBeOnSearchPage = target.shouldBeOnBirthSearchPage;

  target.shouldBeOnDeathSearchPage = function() {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    this.shouldBeFocusedOnField('input[name="system-number"]');
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from death certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.contain('Date of birth or death');
  };

  target.shouldBeOnMarriageSearchPage = function() {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    this.shouldBeFocusedOnField('input[name="system-number"]');
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from marriage certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.contain('Date of marriage');
  };

  target.shouldBeFocusedOnField = function(selector) {
    this.$(selector).hasFocus().should.be.true;
  };

  target.submitBirthSearchPage = function(systemNumber, surname, forenames, dob) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dob"]', dob);
    this.click('input[type="submit"]');
  };

  /**
   * @deprecated
   */
  target.submitSearchPage = target.submitBirthSearchPage;

  target.submitDeathSearchPage = function(systemNumber, surname, forenames, dobd) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dobd"]', dobd);
    this.click('input[type="submit"]');
  };

  target.submitMarriageSearchPage = function(systemNumber, surname, forenames, dom) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dom"]', dom);
    this.click('input[type="submit"]');
  };

  target.hintShowing = function(selector) {
    this.isVisible(selector).should.be.true;
  };
};
