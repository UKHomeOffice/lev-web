'use strict';

const url = require('../config').url;

module.exports = (target) => {

  target.shouldBeOn404Page = () => {
    target.getText('h1').should.equal('Error');
    target.getText('main').should.contain('Not found');
  };

  target.doBadBirthSearch = function () {
    this.url(url + '/details/404');
  };
};