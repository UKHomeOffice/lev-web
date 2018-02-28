'use strict';

const http = require('http');
const httpProxy = require('http-proxy');

const proxy = (fromHost, fromPort, toHost, toPort, accessToken, client, username) => {
  // Create a proxy server with custom application logic
  const myProxy = httpProxy.createProxyServer({});

  // To modify the proxy connection before data is sent, you can listen
  // for the 'proxyReq' event. When the event is fired, you will receive
  // the following arguments:
  // (http.ClientRequest proxyReq, http.IncomingMessage req,
  //  http.ServerResponse res, Object options). This mechanism is useful
  // when you need to modify the proxy request before the proxy
  // connection is made to the target.
  myProxy.on('proxyReq', (proxyReq) => {
    proxyReq.setHeader('X-Auth-Token', accessToken || '<token>');
    proxyReq.setHeader('X-Auth-Username', username || 'localuser');
    proxyReq.setHeader('X-Auth-Aud', client || 'lev-web');
  });

  const server = http.createServer((req, res) => {
    // You can define here your custom logic to handle the request and
    // then proxy the request.
    myProxy.web(req, res, {
      target: `http://${toHost}:${toPort}`
    });
  });

  console.log(`Mock keycloak-proxy is proxying from ${fromHost}:${fromPort} to ${toHost}:${toPort}`);
  server.listen(fromPort, fromHost);
  return server;
};

module.exports = proxy;
