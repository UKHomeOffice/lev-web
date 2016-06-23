'use strict';

const request = require('./request-with-oauth2');
const requestHelper = require('./request-helper');
const fs = require('fs');
const config = require('../config');

const addTlsConfig = (requestArgs) => {
  if(config.lev_tls.key || config.lev_tls.cert || config.lev_tls.ca) {
    requestArgs = requestHelper.urlToObject(requestArgs);

    requestArgs.key = fs.readFileSync(config.lev_tls.key);
    requestArgs.cert = fs.readFileSync(config.lev_tls.cert);
    requestArgs.ca = fs.readFileSync(config.lev_tls.ca);
  }

  return requestArgs;
}

const get = (requestGetArgs, oauthUrl, clientId, clientSecret, username, password, callback) => {
  return request.get(addTlsConfig(requestGetArgs), oauthUrl, clientId, clientSecret, username, password, callback);
}

module.exports = {
  get: get
};
