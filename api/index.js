'use strict';

const helpers = require('./helpers.js');
const levRequest = require('../lib/lev-request');
const config = require('../config');

const oauthUrl = config.oauth && config.oauth.oauthUrl;
const clientId = config.oauth && config.oauth.clientId;
const clientSecret = config.oauth && config.oauth.clientSecret;
const oAuthUsername = config.oauth && config.oauth.username;
const oAuthPassword = config.oauth && config.oauth.password;

const endpoint = `${config.api.protocol}://${config.api.host}:${config.api.port}/api/v0/events/birth`;

const requestData = (url, user) => new Promise((resolve, reject) => levRequest.get({
      'url': url,
      'headers': user
        ? { 'X-Auth-Downstream-Username': user }
        : {}
    },
    oauthUrl,
    clientId,
    clientSecret,
    oAuthUsername,
    oAuthPassword,
    helpers.responseHandler(resolve, reject)));

const query = (attrs, user) => {
  if (attrs === undefined) {
    throw new ReferenceError('query(): first argument was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('query(): second argument was not defined');
  } else if (!(attrs instanceof Object)) {
    throw new TypeError('query(): first argument must be an object');
  } else if (typeof user !== 'string') {
    throw new TypeError('query(): second argument must be a string');
  }

  return requestData(helpers.buildQueryUri(endpoint, attrs), user)
    .then((data) => data.map(helpers.processRecord));
};

const requestID = (id, user) => {
  if (id === undefined) {
    throw new ReferenceError('requestID(): first argument was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('requestID(): second argument was not defined');
  } else if ((!Number.isInteger(id))) {
    throw new TypeError('requestID(): first argument must be an integer');
  } else if (typeof user !== 'string') {
    throw new TypeError('requestID(): second argument must be a string');
  }

  return requestData(endpoint + '/' + id, user)
    .then(helpers.processRecord);
};

const read = (attrs, user) => {
  if (attrs === undefined) {
    throw new ReferenceError('query(): first argument was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('query(): second argument was not defined');
  } else if (!(attrs instanceof Object)) {
    throw new TypeError('query(): first argument must be an object');
  } else if (typeof user !== 'string') {
    throw new TypeError('query(): second argument must be a string');
  }

  const systemNumber = attrs['system-number'] && Number.parseInt(attrs['system-number'], 10);

  return systemNumber
    ? requestID(systemNumber, user).then((data) => [data])
    : query(attrs, user);
};

module.exports = {
  query: query,
  read: read,
  requestID: requestID
};
