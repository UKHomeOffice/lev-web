'use strict';

var mockProxy = require('./mock-proxy');

before(function () {
  mockProxy.listen();
});
