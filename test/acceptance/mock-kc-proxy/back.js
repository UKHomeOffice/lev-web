'use strict';

process.title = 'lev-api-keycloak-proxy';
const proxy = require('./');

const server = proxy('localhost', 8080, 'localhost', 80, '<audit-token>');

// gracefully handle shutdowns -----------------------

const closeGracefully = (signal) => {
  setTimeout(() => {
    console.warn('Forcefully shutting down from sig:', signal);
    process.exit(0); // eslint-disable-line no-process-exit
  }, 500);

  server.close(() => process.exit(0)); // eslint-disable-line no-process-exit
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
  process.on(signal, () => closeGracefully(signal))
);
