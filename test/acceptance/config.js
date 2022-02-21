'use strict';

const config = require('../../config');

const env = process.env.ENV || 'local';

module.exports = {
  url: process.env.TEST_URL || 'http://localhost:8001',
  env: env,
  e2e: env !== 'local',
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  MAX_AUDIT_RANGE: config.MAX_AUDIT_RANGE
};
