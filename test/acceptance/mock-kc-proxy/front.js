'use strict';

process.title = 'lev-keycloak-proxy';
const proxy = require('./');
const proxyHost = process.env.PROXY_HOST || 'localhost';
const listenHost = process.env.LISTEN_HOST || 'localhost';

const server = proxy(listenHost, 8002, proxyHost, 8001, '<audit-token>');

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
