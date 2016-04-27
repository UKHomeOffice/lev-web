'use strict';

var config = require('../../../config');
var _ = require('underscore');
var express = require('express');
var httpProxy = require('http-proxy')
  .createServer({
    target:
      'http://' +
      config.api.real.host +
      ':' +
      config.api.real.port
  });

require('express-hijackresponse');

var app = express();
var willReturn = 1;

app.use(function hijackRes(req, response, next) {
  response.hijack(function (err, res) {
    if (err) {
      res.unhijack();
      return next(err);
    }
    if (/\/json/.test(res.getHeader('Content-Type'))) {
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
                events = events.concat(_.times(willReturn - length, function() {
                  return e;
                }));
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
  willReturn: function setWillReturn(items) {
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
