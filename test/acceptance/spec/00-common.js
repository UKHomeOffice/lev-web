'use strict';

const _ = require('lodash');

// Set up mocks as required
// //////////////////////////////////////////////////////////////////////
const mockProxy = require('../mock-proxy');
const mockKcProxy = require('../mock-kc-proxy');
const testConfig = require('../config');

if (testConfig.env === 'local') {
  mockProxy.listen();
  mockKcProxy('localhost', 8002, 'localhost', 8001);
}

// Add mixins to browser
// //////////////////////////////////////////////////////////////////////
const mixins = [
  require('../mixins/login'),
  require('../mixins/search'),
  require('../mixins/results'),
  require('../mixins/details'),
  require('../mixins/logout')
];

before(() => {
  _.each(mixins, (mixin) => {
    mixin(browser);
  });
});
