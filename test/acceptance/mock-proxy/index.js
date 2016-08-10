'use strict';

var config = require('../../../config');
var _ = require('lodash');
var express = require('express');
var httpProxy = require('http-proxy')
  .createServer({
    target: `http://${config.api.real.host}:${config.api.real.port}`
  });

require('express-hijackresponse');

var app = express();
var willReturn = 1;
var user = 'lev-test-client';

// This simulates the keycloak proxy in front of the API, adding appropriate header
httpProxy.on('proxyReq', function(proxyReq) {
  proxyReq.setHeader('X-Auth-Username', user);
});

app.use(function hijackRes(req, response, next) {
  response.hijack(function hijacked(err, res) {
    if (err) {
      res.unhijack();
      next(err);
    } else if (/\/json/.test(res.getHeader('Content-Type'))) {
      res.removeHeader('Content-Length');
      res.writeHead(res.statusCode);

      res.body = '';

      res.on('data', function onData(chunk) {
          res.body += chunk;
      }).on('end', function onEnd() {
          try {
            var events = JSON.parse(res.body);
            var length = events.length;

            if (length > 0) {
              if (length > willReturn) {
                events = _.take(events, willReturn);
              } else if (length < willReturn) {
                var e = _.first(events);
                events = events.concat(_.times(willReturn - length, () => e));
              }

              res.body = JSON.stringify(events);
            }
          } catch (error) {
            // Squash the error (just write the original response)
          }

          res.write(res.body);
          res.end();
      });
    } else {
      res.unhijack();
    }
  });

  next();
});

app.use(function proxy(req, res) {
  httpProxy.web(req, res);
});

var server;

module.exports = {
  willReturnForLocalTests: function setWillReturn(items) {
    willReturn = items;
  },

  listen: function listen() {
    console.log('Mock proxy listening on port ' + config.api.port);
    server = app.listen(config.api.port);
    return server;
  },

  close: function close() {
    console.log('Mock proxy closing');
    return server.close();
  }
};
