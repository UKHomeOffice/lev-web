'use strict';
var config = require('../config');

module.exports = function errorMiddlewareFactory() {

  return function errorHandler(err, req, res, next) {
    var content = {};

    if (!req.session || !req.session.model) {
      err.code = 'SESSION_TIMEOUT';
      content.title = 'Session expired';
      content.message = 'Session expired';
    }

    err.template = 'error';
    content.title = content.title || 'Error';
    content.message = content.message || 'Error';

    res.statusCode = err.status || 500;

    if (res.render) {
      res.render('pages/' + err.template, {
        error: err,
        content: content,
        showStack: config.env === 'development',
        startLink: req.path ? req.path.replace(/^\/([^\/]*).*$/, '') : ''
      });
    } else {
      // Cannot render so log to the console
      /*eslint no-console: 0*/
      console.log('Error: ', err);
      res.end();
    }

    next();
  };

};
