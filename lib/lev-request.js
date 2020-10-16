'use strict';

const request = require('request');
const requestHelper = require('./request-helper');
const fs = require('fs');
const config = require('../config');

const addTlsConfig = (requestArgs) => {
  requestArgs = requestHelper.urlToObject(requestArgs);

  requestArgs.agentOptions = requestArgs.agentOptions || {};
  requestArgs.agentOptions.rejectUnauthorized = config.lev_tls.verify !== false;

  if (config.lev_tls.key || config.lev_tls.cert || config.lev_tls.ca) {
    requestArgs.key = config.lev_tls.key ? fs.readFileSync(config.lev_tls.key) : undefined;
    requestArgs.cert = config.lev_tls.cert ? fs.readFileSync(config.lev_tls.cert) : undefined;
    requestArgs.ca = config.lev_tls.ca ? fs.readFileSync(config.lev_tls.ca) : undefined;
  }

  return requestArgs;
};

const addAuthHeaders = (requestArgs, requestInfo) => {
  const token = requestInfo && requestInfo.token;
  const roles = requestInfo && requestInfo.roles;

  requestArgs = requestHelper.urlToObject(requestArgs);
  requestArgs.headers = requestArgs.headers || {};
  requestArgs.headers['X-Auth-Username'] = config.api.username;
  requestArgs.headers['X-Auth-Aud'] = config.api.clientName;

  if (token) {
    requestArgs.headers.Authorization = 'Bearer ' + token;
  } else if (roles) {
    requestArgs.headers['X-Auth-Roles'] = roles.join(',');
  }

  return requestArgs;
};

const get = (requestGetArgs, requestInfo, callback) => {
  const token = requestInfo && requestInfo.token;

  return request.get(addTlsConfig(addAuthHeaders(requestGetArgs, requestInfo)), token, callback);
};

module.exports = {
  get: get
};
