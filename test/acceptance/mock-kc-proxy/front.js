'use strict';

process.title = 'lev-keycloak-proxy';
const proxy = require('./');
const proxyHost = process.env.PROXY_HOST || 'localhost';
const proxyPort = process.env.PROXY_PORT || 8001;
const listenHost = process.env.LISTEN_HOST || 'localhost';
const listenPort = process.env.LISTEN_PORT || 8002;

const server = proxy(listenHost, listenPort, proxyHost, proxyPort, '<audit-token>');

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
