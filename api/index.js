'use strict';

const moment = require('moment');
const helpers = require('./helpers.js');
const levRequest = require('../lib/lev-request');
const config = require('../config');

const baseURL = `${config.api.protocol}://${config.api.host}:${config.api.port}`;
const birthSearch = `${baseURL}/api/v0/events/birth`;
const deathSearch = `${baseURL}/v1/registration/death`;
const marriageSearch = `${baseURL}/v1/registration/marriage`;
const userActivity = `${baseURL}/api/v0/audit/user-activity`;

const requestData = (url, accessToken) =>
  new Promise((resolve, reject) =>
    levRequest.get({
      'url': url
    },
    accessToken,
    helpers.responseHandler(resolve, reject)
  ));

const findByNameDOB = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findByNameDOB(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findByNameDOB(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findByNameDOB(): second argument, accessToken, must be a string');
  }

  return requestData(helpers.buildQueryUri(birthSearch, searchFields), accessToken)
    .then((data) => data.map(helpers.processRecord));
};

const findBySystemNumber = (systemNumber, accessToken) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findBySystemNumber(): second argument, accessToken, must be a string');
  }

  return requestData(birthSearch + '/' + systemNumber, accessToken)
    .then(helpers.processRecord);
};

const findBirths = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findBirths(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findBirths(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findBirths(): second argument, accessToken, must be a string');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findBySystemNumber(systemNumber, accessToken).then((data) => [data])
    : findByNameDOB(searchFields, accessToken);
};

const findDeathsByNameDate = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findDeathsByNameDate(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findDeathsByNameDate(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findDeathsByNameDate(): second argument, accessToken, must be a string');
  }

  return requestData(helpers.buildQueryUri(deathSearch, searchFields), accessToken)
    .then((data) => data.map(helpers.processDeathRecord));
};

const findDeathBySystemNumber = (systemNumber, accessToken) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findDeathsBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findDeathsBySystemNumber(): second argument, accessToken, must be a string');
  }

  return requestData(deathSearch + '/' + systemNumber, accessToken)
    .then(helpers.processDeathRecord);
};

const findDeaths = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findDeaths(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findDeaths(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findDeaths(): second argument, accessToken, must be a string');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findDeathBySystemNumber(systemNumber, accessToken).then((data) => [data])
    : findDeathsByNameDate(searchFields, accessToken);
};

const findMarriagesByNameDOB = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findMarriagesByNameDOB(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findMarriagesByNameDOB(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findMarriagesByNameDOB(): second argument, accessToken, must be a string');
  }

  return requestData(helpers.buildQueryUri(marriageSearch, searchFields), accessToken)
    .then((data) => data.map(helpers.processMarriageRecord));
};

const findMarriageBySystemNumber = (systemNumber, accessToken) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findMarriagesBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findMarriagesBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findMarriagesBySystemNumber(): second argument, accessToken, must be a string');
  }

  return requestData(marriageSearch + '/' + systemNumber, accessToken)
    .then(helpers.processMarriageRecord);
};

const findMarriages = (searchFields, accessToken) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findMarriages(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findMarriages(): first argument, searchFields, must be an object');
  } else if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('findMarriages(): second argument, accessToken, must be a string');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findMarriageBySystemNumber(systemNumber, accessToken).then((data) => [data])
    : findMarriagesByNameDOB(searchFields, accessToken);
};

const userActivityReport = (accessToken, from, to, userFilter) => { // eslint-disable-line complexity
  if (accessToken !== undefined && typeof accessToken !== 'string') {
    throw new TypeError('The "accessToken" parameter must be a string');
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
  if (moment(from).add(config.MAX_AUDIT_RANGE, 'days').isBefore(to)) {
    throw new RangeError(`maximum date range exceeded (should be less than ${config.MAX_AUDIT_RANGE} days)`);
  }
  if (userFilter !== undefined && typeof userFilter !== 'string') {
    throw new TypeError('The "userFilter" parameter must be a string');
  }

  const data = {
    from: from,
    to: to,
    user: userFilter
  };

  return requestData(helpers.buildQueryUri(userActivity, data), accessToken);
};

module.exports = {
  findBirths: findBirths,
  findByNameDOB: findByNameDOB,
  findBySystemNumber: findBySystemNumber,
  findDeaths: findDeaths,
  findDeathBySystemNumber: findDeathBySystemNumber,
  findMarriages: findMarriages,
  findMarriageBySystemNumber: findMarriageBySystemNumber,
  userActivityReport: userActivityReport
};
