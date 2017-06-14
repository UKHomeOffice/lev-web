'use strict';

const moment = require('moment');
const helpers = require('./helpers.js');
const levRequest = require('../lib/lev-request');
const config = require('../config');

const oauthUrl = config.oauth && config.oauth.oauthUrl;
const clientId = config.oauth && config.oauth.clientId;
const clientSecret = config.oauth && config.oauth.clientSecret;
const oAuthUsername = config.oauth && config.oauth.username;
const oAuthPassword = config.oauth && config.oauth.password;

const baseURL = `${config.api.protocol}://${config.api.host}:${config.api.port}/api/v0`;
const birthSearch = `${baseURL}/events/birth`;
const userActivity = `${baseURL}/audit/user-activity`;

const requestData = (url, user) =>
  new Promise((resolve, reject) =>
    levRequest.get({
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
    helpers.responseHandler(resolve, reject)
  ));

const findByNameDOB = (searchFields, user) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findByNameDOB(): first argument, searchFields, was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('findByNameDOB(): second argument, user, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findByNameDOB(): first argument, searchFields, must be an object');
  } else if (typeof user !== 'string') {
    throw new TypeError('findByNameDOB(): second argument, user, must be a string');
  }

  return requestData(helpers.buildQueryUri(birthSearch, searchFields), user)
    .then((data) => data.map(helpers.processRecord));
};

const findBySystemNumber = (systemNumber, user) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findBySystemNumber(): first argument, systemNumber, was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('findBySystemNumber(): second argument, user, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (typeof user !== 'string') {
    throw new TypeError('findBySystemNumber(): second argument, user, must be a string');
  }

  return requestData(birthSearch + '/' + systemNumber, user)
    .then(helpers.processRecord);
};

const findBirths = (searchFields, user) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findBirths(): first argument, searchFields, was not defined');
  } else if (user === undefined) {
    throw new ReferenceError('findBirths(): second argument, user, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findBirths(): first argument, searchFields, must be an object');
  } else if (typeof user !== 'string') {
    throw new TypeError('findBirths(): second argument, user, must be a string');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findBySystemNumber(systemNumber, user).then((data) => [data])
    : findByNameDOB(searchFields, user);
};

const userActivityReport = (user, from, to, userFilter) => {
  if (!user) {
    throw new ReferenceError('The "user" parameter was not provided');
  }
  if (typeof user !== 'string') {
    throw new TypeError('The "user" parameter must be a string');
  }
  if (!from || !to) {
    throw new ReferenceError('"from" and "to" dates must be provided for the User Activity report');
  }
  if (!(from instanceof moment) || !(to instanceof moment)) {
    throw new TypeError('"from" and "to" dates for the User Activity report must be Moment objects');
  }
  if (!from.isValid() || !to.isValid()) {
    throw new RangeError('"from" and "to" dates for the User Activity report must be valid dates');
  }
  if (from.isAfter(to)) {
    throw new RangeError('"from" date must be before "to" date for the User Activity report');
  }

  const data = {
    from: from,
    to: to,
    user: userFilter
  };

  return requestData(helpers.buildQueryUri(userActivity, data), user);
};

module.exports = {
  findBirths: findBirths,
  findByNameDOB: findByNameDOB,
  findBySystemNumber: findBySystemNumber,
  userActivityReport: userActivityReport
};
