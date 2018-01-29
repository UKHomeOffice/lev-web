'use strict';

/* eslint no-process-env: 0*/
/* eslint camelcase: 0*/
const conf = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8001,
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  api: {
    protocol: process.env.API_PROTOCOL || 'http',
    host: process.env.API_PORT_8080_TCP_ADDR || process.env.API_HOST || 'localhost',
    port: process.env.API_PORT_8080_TCP_POST || process.env.API_PORT || 8080
  },
  session: {
    secret: process.env.SESSION_SECRET || 'secret'
  },
  lev_tls: {
    key: process.env.LEV_TLS_KEY || null,
    cert: process.env.LEV_TLS_CERT || null,
    ca: process.env.LEV_TLS_CA || null,
    verify: String(process.env.LEV_TLS_VERIFY).match(/false/i) === null
  },
  MAX_AUDIT_RANGE: 92
};

module.exports = conf;
