'use strict';

const url = require('../config').url;
const userActivity = `${url}/audit/user-activity`;

module.exports = (target) => {
  target.generateReport = function(from, to) {
    this.goToUserActivityReport();
    this.submitUserActivityReport(from, to);
  };

  target.goToUserActivityReport = function() {
    this.url(userActivity);
  };

  target.shouldBeOnUserActivityReport = function() {
    this.getText('h1').should.equal('Audit information');

    this.waitForVisible('input[name="from"]', 5000);
    const formLabels = this.getText('label');
    formLabels[0].should.match(/^Search from/);
    formLabels[1].should.match(/^Search to/);
  };

  target.submitUserActivityReport = function(from, to) {
    this.setValue('input[name="from"]', from);
    this.setValue('input[name="to"]', to);
    this.submitForm('form');
  };
};
