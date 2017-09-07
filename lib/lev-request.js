'use strict';

const request = require('request');
const requestHelper = require('./request-helper');
const fs = require('fs');
const config = require('../config');

const addTlsConfig = (requestArgs) => {
  if (config.lev_tls.key || config.lev_tls.cert || config.lev_tls.ca) {
    requestArgs = requestHelper.urlToObject(requestArgs);

    requestArgs.key = config.lev_tls.key ? fs.readFileSync(config.lev_tls.key) : undefined;
    requestArgs.cert = config.lev_tls.cert ? fs.readFileSync(config.lev_tls.cert) : undefined;
    requestArgs.ca = config.lev_tls.ca ? fs.readFileSync(config.lev_tls.ca) : undefined;

    requestArgs.agentOptions = {
      rejectUnauthorized: false
    };
  }

  return requestArgs;
};

const addBearerToken = (requestArgs, token) => {
  if (token) {
    requestArgs = requestHelper.urlToObject(requestArgs);
    requestArgs.headers = requestArgs.headers || {};
    requestArgs.headers.Authorization = 'Bearer ' + token;
  }

  return requestArgs;
};

const get = (requestGetArgs, accessToken, callback) => {
  return request.get(addTlsConfig(addBearerToken(requestGetArgs, accessToken)), accessToken, callback);
};

module.exports = {
  get: get
};
