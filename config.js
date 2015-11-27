'use strict';

/*eslint no-process-env: 0*/
/*eslint camelcase: 0*/
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8001,
  listen_host: process.env.LISTEN_HOST || '0.0.0.0'
};
