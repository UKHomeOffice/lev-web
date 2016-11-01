'use strict';

const route = require('express').Router();

const respond = (req, res) => {
  res.send('OK');
};

route.get('/healthz', respond);
route.get('/readiness', respond);

module.exports = route;
