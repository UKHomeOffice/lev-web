'use strict';

/*eslint no-process-env: 0*/
/*eslint camelcase: 0*/
/*eslint no-multi-spaces: 0*/
var api = {
  host: process.env.API_PORT_8080_TCP_ADDR || process.env.API_HOST || 'localhost',
  port: process.env.API_PORT_8080_TCP_POST || process.env.API_PORT || 8080
};

/*eslint no-process-env: 0*/
/*eslint camelcase: 0*/
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8001,
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  api: {
    real: api,
    host: process.env.NODE_ENV === 'acceptance' ? 'localhost' : api.host,
    port: process.env.NODE_ENV === 'acceptance' ? 8081 : api.port,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'secret',
  }
};
