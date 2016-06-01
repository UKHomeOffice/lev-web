'use strict';

const url = require('../config').url;

module.exports = (target) => {
  target.logout = function () {
    this.url(url);
    this.clickLogout();
  };

  target.clickLogout = function () {
    browser.click('#sign-out');
  };
};
