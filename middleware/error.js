'use strict';
const config = require('../config');
const logger = require('../lib/logger');

module.exports = function errorMiddlewareFactory() {

  /* eslint no-unused-vars: 0*/
  return function errorHandler(err, req, res, next) {
    const content = {};

    err.template = 'error';
    content.title = content.title || err.error || 'Error';
    content.message = content.message || err.message || err || 'Error';

    res.statusCode = err.status || 500;

    logger.error(err);

    if (res.render) {
      res.render('pages/' + err.template, {
        error: err,
        content: content,
        showStack: config.env === 'development',
        startLink: req.path && req.path.startsWith('/audit/user-activity') ? 'audit/user-activity' : ''
      });
    } else {
      // Cannot render
      res.end();
    }
  };

};
