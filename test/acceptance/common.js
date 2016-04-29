'use strict';

var mockProxy = require('./mock-proxy');
var testConfig = require('./config');

before(function () {
  mockProxy.listen();

  doLogin();
});

function doLogin() {
  browser.url('http://lev-web-dev.dsp.notprod.homeoffice.gov.uk/');
  browser.setValue('input[name="username"]', testConfig.username);
  browser.setValue('input[name="password"]', testConfig.password);
  browser.submitForm('form');
}