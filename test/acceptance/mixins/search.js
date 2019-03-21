'use strict';

const url = require('../config').url;

module.exports = (target) => {
  target.search = function(systemNumber, surname, forenames, dob) {
    this.goToSearchPage();
    this.submitSearchPage(systemNumber, surname, forenames, dob);
  };

  target.birthSearch = target.search;

  target.deathSearch = function(systemNumber, surname, forenames, dobd) {
    this.goToDeathSearchPage();
    this.submitDeathSearchPage(systemNumber, surname, forenames, dobd);
  };

  target.marriageSearch = function(systemNumber, surname, forenames, dom) {
    this.goToMarriageSearchPage();
    this.submitMarriageSearchPage(systemNumber, surname, forenames, dom);
  };

  target.partnershipSearch = function(systemNumber, surname, forenames, dop) {
    this.goToPartnershipSearchPage();
    this.submitPartnershipSearchPage(systemNumber, surname, forenames, dop);
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

  target.goToSearchPage = function() {
    this.url(url);
  };

  target.goToBirthSearchPage = target.goToSearchPage;

  target.goToDeathSearchPage = function() {
    this.url(url + '/death');
  };

  target.goToMarriageSearchPage = function() {
    this.url(url + '/marriage');
  };

  target.goToPartnershipSearchPage = function() {
    this.url(url + '/partnership');
  };

  target.shouldBeOnSearchPage = function() {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    this.shouldBeFocusedOnField('input[name="system-number"]');
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from birth certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.contain('Date of birth');
  };

  target.shouldBeOnBirthSearchPage = target.shouldBeOnSearchPage;

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

  target.shouldBeOnPartnershipSearchPage = function() {
    this.getText('h1').should.equal('Applicant\'s details');

    this.waitForVisible('input[name="system-number"]', 5000);
    this.shouldBeFocusedOnField('input[name="system-number"]');
    const formLabels = this.getText('label');
    formLabels[0].should.equal('System number from partnership certificate');
    formLabels[1].should.equal('Surname');
    formLabels[2].should.equal('Forename(s)');
    formLabels[3].should.contain('Date of partnership');
  };

  target.shouldBeFocusedOnField = function(selector) {
    this.$(selector).hasFocus().should.be.true;
  };

  target.submitSearchPage = function(systemNumber, surname, forenames, dob) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dob"]', dob);
    this.click('input[type="submit"]');
  };

  target.submitBirthSearchPage = target.submitSearchPage;

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

  target.submitPartnershipSearchPage = function(systemNumber, surname, forenames, dop) {
    this.setValue('input[name="system-number"]', systemNumber);
    this.setValue('input[name="surname"]', surname);
    this.setValue('input[name="forenames"]', forenames);
    this.setValue('input[name="dop"]', dop);
    this.click('input[type="submit"]');
  };

  target.hintShowing = function(selector) {
    this.isVisible(selector).should.be.true;
  };
};
