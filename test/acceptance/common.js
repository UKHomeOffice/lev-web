'use strict';

var mockProxy = require('./mock-proxy');
var testConfig = require('./config');

before(function () {
  if (testConfig.env === 'local') {
    mockProxy.listen();
  }
});

beforeEach(function () {
  if (testConfig.env !== 'local') {
    doLogin();
  }
});

afterEach(function () {
  if (testConfig.env !== 'local' && browser.isExisting('#logout')) {
    browser.click('#logout');
  }
});

function doLogin() {
  browser.url(testConfig.url);
  browser.setValue('input[name="username"]', testConfig.username);
  browser.setValue('input[name="password"]', testConfig.password);
  browser.submitForm('form');
}
