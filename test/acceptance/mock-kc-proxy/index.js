'use strict';

var http = require('http'),
  httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});
var target = 'http://127.0.0.1:8001';
var port = 8002;
var user = 'tester';

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Auth-Username', user);
});

var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, {
    target: target
  });
});

var listen = function listen() {
  console.log('Mock keycloak-proxy listening on port 8002');
  server.listen(port);
  return server;
};

if (process.env.RUN_KC_PROXY) {
  listen()
}

module.exports = {
  listen: listen
};
