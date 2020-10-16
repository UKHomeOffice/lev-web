'use strict';

const moment = require('moment');
const helpers = require('./helpers.js');
const levRequest = require('../lib/lev-request');
const config = require('../config');

const baseURL = `${config.api.protocol}://${config.api.host}:${config.api.port}`;
const birthSearch = `${baseURL}/api/v0/events/birth`;
const deathSearch = `${baseURL}/v1/registration/death`;
const marriageSearch = `${baseURL}/v1/registration/marriage`;
const partnershipSearch = `${baseURL}/v1/registration/partnership`;
const userActivity = `${baseURL}/api/v0/audit/user-activity`;

const requestData = (url, requestInfo) =>
  new Promise((resolve, reject) =>
    levRequest.get({
      'url': url
    },
    requestInfo,
    helpers.responseHandler(resolve, reject)
  ));

const findByNameDOB = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findByNameDOB(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findByNameDOB(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findByNameDOB(): second argument, requestInfo, must be an object');
  }

  return requestData(helpers.buildQueryUri(birthSearch, searchFields), requestInfo)
    .then((data) => data.map(helpers.processRecord));
};

const findBySystemNumber = (systemNumber, requestInfo) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findBySystemNumber(): second argument, requestInfo, must be an object');
  }

  return requestData(birthSearch + '/' + systemNumber, requestInfo)
    .then(helpers.processRecord);
};

const findBirths = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findBirths(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findBirths(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findBirths(): second argument, requestInfo, must be an object');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findBySystemNumber(systemNumber, requestInfo).then((data) => [data])
    : findByNameDOB(searchFields, requestInfo);
};

const findDeathsByNameDate = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findDeathsByNameDate(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findDeathsByNameDate(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findDeathsByNameDate(): second argument, requestInfo, must be an object');
  }

  return requestData(helpers.buildQueryUri(deathSearch, searchFields), requestInfo)
    .then((data) => data.map(helpers.processDeathRecord));
};

const findDeathBySystemNumber = (systemNumber, requestInfo) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findDeathsBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findDeathsBySystemNumber(): second argument, requestInfo, must be an object');
  }

  return requestData(deathSearch + '/' + systemNumber, requestInfo)
    .then(helpers.processDeathRecord);
};

const findDeaths = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findDeaths(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findDeaths(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findDeaths(): second argument, requestInfo, must be an object');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findDeathBySystemNumber(systemNumber, requestInfo).then((data) => [data])
    : findDeathsByNameDate(searchFields, requestInfo);
};

const findMarriagesByNameDOM = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findMarriagesByNameDOM(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findMarriagesByNameDOM(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findMarriagesByNameDOM(): second argument, requestInfo, must be an object');
  }

  return requestData(helpers.buildQueryUri(marriageSearch, searchFields), requestInfo)
    .then((data) => data.map(helpers.processMarriageRecord));
};

const findMarriageBySystemNumber = (systemNumber, requestInfo) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findMarriagesBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findMarriagesBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findMarriagesBySystemNumber(): second argument, requestInfo, must be an object');
  }

  return requestData(marriageSearch + '/' + systemNumber, requestInfo)
    .then(helpers.processMarriageRecord);
};

const findMarriages = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findMarriages(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findMarriages(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findMarriages(): second argument, requestInfo, must be an object');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findMarriageBySystemNumber(systemNumber, requestInfo).then((data) => [data])
    : findMarriagesByNameDOM(searchFields, requestInfo);
};

const findPartnershipsByNameDOP = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findPartnershipsByNameDOP(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findPartnershipsByNameDOP(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findPartnershipsByNameDOP(): second argument, requestInfo, must be an object');
  }

  return requestData(helpers.buildQueryUri(partnershipSearch, searchFields), requestInfo)
    .then((data) => data.map(helpers.processPartnershipRecord));
};

const findPartnershipBySystemNumber = (systemNumber, requestInfo) => {
  if (systemNumber === undefined) {
    throw new ReferenceError('findPartnershipsBySystemNumber(): first argument, systemNumber, was not defined');
  } else if ((!Number.isInteger(systemNumber))) {
    throw new TypeError('findPartnershipsBySystemNumber(): first argument, systemNumber, must be an integer');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findPartnershipsBySystemNumber(): second argument, requestInfo, must be an object');
  }

  return requestData(partnershipSearch + '/' + systemNumber, requestInfo)
    .then(helpers.processPartnershipRecord);
};

const findPartnerships = (searchFields, requestInfo) => {
  if (searchFields === undefined) {
    throw new ReferenceError('findPartnerships(): first argument, searchFields, was not defined');
  } else if (!(searchFields instanceof Object)) {
    throw new TypeError('findPartnerships(): first argument, searchFields, must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('findPartnerships(): second argument, requestInfo, must be an object');
  }

  const systemNumber = searchFields['system-number'] && Number.parseInt(searchFields['system-number'], 10);

  return systemNumber
    ? findPartnershipBySystemNumber(systemNumber, requestInfo).then((data) => [data])
    : findPartnershipsByNameDOP(searchFields, requestInfo);
};

const userActivityReport = (requestInfo, from, to, userFilter) => { // eslint-disable-line complexity
  if (requestInfo === undefined) {
    throw new ReferenceError('The "requestInfo" parameter must be an object');
  } else if (!(requestInfo instanceof Object)) {
    throw new TypeError('The "requestInfo" parameter must be an object');
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

  return requestData(helpers.buildQueryUri(userActivity, data), requestInfo);
};

module.exports = {
  findBirths: findBirths,
  findByNameDOB: findByNameDOB,
  findBySystemNumber: findBySystemNumber,
  findDeaths: findDeaths,
  findDeathBySystemNumber: findDeathBySystemNumber,
  findMarriages: findMarriages,
  findMarriageBySystemNumber: findMarriageBySystemNumber,
  findPartnerships: findPartnerships,
  findPartnershipsByNameDOP: findPartnershipsByNameDOP,
  findPartnershipBySystemNumber: findPartnershipBySystemNumber,
  userActivityReport: userActivityReport
};
