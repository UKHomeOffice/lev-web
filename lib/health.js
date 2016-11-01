'use strict';

const route = require('express').Router();

const respond = (req, res, next) => {
  if (req.ip === '127.0.0.1' || req.ip === 'localhost') {
    res.send('OK');
  } else {
    next();
  }
};

route.get('/healthz', respond);
route.get('/readiness', respond);

module.exports = route;
