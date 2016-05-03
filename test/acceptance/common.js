'use strict';

var mockProxy = require('./mock-proxy');
var testConfig = require('./config');

before(function () {
  if (testConfig.env !== 'local') {
    doLogin();
  } else {
    mockProxy.listen();
  }
});

function doLogin() {
  browser.url(testConfig.url);
  console.log('Attempting login....');
  browser.setValue('input[name="username"]', testConfig.username);
  browser.setValue('input[name="password"]', testConfig.password);
  browser.submitForm('form');
  console.log('Login successful')
}