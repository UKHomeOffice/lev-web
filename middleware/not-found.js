'use strict';
var config = require('../config');
var logger = require('../lib/logger');

module.exports = function notFoundMiddlewareFactory() {

  /* eslint no-unused-vars: 0*/
  return function requestHandler(req, res, next) {
    var content = {};

    content.title = 'Error';
    content.message = 'Not found';

    res.statusCode = 404;

    if (res.render) {
      res.render('pages/error', {
        content: content,
        showStack: false,
        startLink: req.path ? req.path.replace(/^\/([^\/]*).*$/, '') : ''
      });
    } else {
      // Cannot render
      res.end();
    }
  };

};
