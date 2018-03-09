'use strict';

const config = require('../../config');

module.exports = {
  url: process.env.TEST_URL || 'http://localhost:8001',
  env: process.env.ENV || 'local',
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  MAX_AUDIT_RANGE: config.MAX_AUDIT_RANGE
};
