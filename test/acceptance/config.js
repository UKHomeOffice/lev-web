'use strict';

const config = require('../../config');

const env = process.env.ENV || 'local';

const conf = {
  url: process.env.TEST_URL || 'http://localhost:8001',
  env: env,
  e2e: env !== 'local',
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  MAX_AUDIT_RANGE: config.MAX_AUDIT_RANGE
};

console.log('ENV:', process.env.ENV);
console.log(conf);

module.exports = conf;
