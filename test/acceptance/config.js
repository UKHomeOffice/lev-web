'use strict';

module.exports = {
  url: process.env.TEST_URL       ||  'http://localhost:8001/',
  env: process.env.ENV            ||  'local',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};
