'use strict';

const _ = require('lodash');
const moment = require('moment');
const querystring = require('querystring');

const formatInternational = 'YYYY-MM-DD';
const formatBritish = 'DD/MM/YYYY';
const statusToName = {
  404: 'NotFoundError',
  401: 'NotAuthorized'
};

const reformatDate = (date, oldFormat, newFormat) =>
  (date instanceof moment ? date : moment(date, oldFormat)).format(newFormat);

const toBritishDateFormat = (date) => reformatDate(date, formatInternational, formatBritish);
const toInternationalDateFormat = (date) => reformatDate(date, formatBritish, formatInternational);

const buildBirthParams = (attrs) => _.pickBy({
  lastname: attrs.surname,
  forenames: attrs.forenames,
  dateofbirth: attrs.dob && toInternationalDateFormat(attrs.dob)
}, _.identity);
const buildDeathParams = (attrs) => _.pickBy({
  surname: attrs.surname,
  forenames: attrs.forenames,
  dateOfBirth: attrs.dob && toInternationalDateFormat(attrs.dob)
}, _.identity);
const buildMarriageParams = (attrs) => _.pickBy({
  surname: attrs.surname,
  forenames: attrs.forenames,
  dateOfBirth: attrs.dob && toInternationalDateFormat(attrs.dob)
}, _.identity);
const buildAuditParams = (attrs) => _.pickBy({
  from: toInternationalDateFormat(attrs.from),
  to: toInternationalDateFormat(attrs.to),
  user: attrs.user
}, _.identity);
const buildQueryUri = (endpoint, attrs) => {
  if (!attrs) {
    return endpoint;
  }
  if (attrs.from && attrs.to) {
    return endpoint + '?' + querystring.stringify(buildAuditParams(attrs));
  } else if (endpoint.match('death')) {
    return endpoint + '?' + querystring.stringify(buildDeathParams(attrs));
  } else if (endpoint.match('marriage')) {
    return endpoint + '?' + querystring.stringify(buildMarriageParams(attrs));
  }
  return endpoint + '?' + querystring.stringify(buildBirthParams(attrs));
};

const refer = (record) => (
    record.status.reRegistered !== 'None' &&
    record.status.reRegistered !== 'Father added' &&
    record.status.reRegistered !== 'Subsequently married' &&
    record.status.reRegistered !== 'Father modified' &&
    record.status.reRegistered !== 'Replacement registration'
  ) ||
  record.status.potentiallyFictitiousBirth !== false ||
  (
    record.status.marginalNote !== 'None' &&
    record.status.marginalNote !== 'Court order in place' &&
    record.status.marginalNote !== 'Court order revoked'
  ) ||
  record.status.cancelled !== false;

const processRecord = (record) => {
  const blocked = record.status.blockedRegistration !== false;
  const block = blocked ? () => 'UNAVAILABLE' : value => value;

  return {
    'system-number': record.systemNumber,
    surname: block(record.subjects.child.name.surname),
    forenames: block(record.subjects.child.name.givenName),
    dob: block(toBritishDateFormat(record.subjects.child.dateOfBirth)),
    gender: block(record.subjects.child.sex),
    'birth-place': block(record.subjects.child.birthplace),
    mother: {
      name: block(record.subjects.mother.name.fullName),
      nee: block(record.subjects.mother.maidenSurname),
      marriageSurname: block(record.subjects.mother.marriageSurname),
      'birth-place': block(record.subjects.mother.birthplace),
      occupation: block(record.subjects.mother.occupation)
    },
    father: {
      name: block(record.subjects.father.name.fullName),
      'birth-place': block(record.subjects.father.birthplace),
      occupation: block(record.subjects.father.occupation)
    },
    registered: {
      by: block(record.subjects.informant.qualification),
      district: block(record.location.registrationDistrict),
      'sub-district': block(record.location.subDistrict),
      'admin-area': block(record.location.administrativeArea),
      date: block(toBritishDateFormat(record.date))
    },
    status: blocked ? {
      refer: true
    } : {
      refer: refer(record),
      fatherAdded: record.status.reRegistered === 'Father added',
      subsequentlyMarried: record.status.reRegistered === 'Subsequently married',
      fatherModified: record.status.reRegistered === 'Father modified',
      replaced: record.status.reRegistered === 'Replacement registration',
      corrected: record.status.correction !== 'None',
      courtOrderInPlace: record.status.marginalNote === 'Court order in place',
      courtOrderRevoked: record.status.marginalNote === 'Court order revoked'
    },
    previousRegistration: blocked ? {
      date: null,
      systemNumber: null
    } : {
      date: record.previousRegistration.date,
      systemNumber: record.previousRegistration.systemNumber
    }
  };
};

const processDeathRecord = r => ({
  id: Number(r.id),
  date: r.date,
  registrar: {
    signature: r.registrar.signature,
    subdistrict: r.registrar.subdistrict,
    district: r.registrar.district,
    administrativeArea: r.registrar.administrativeArea
  },
  deceased: {
    forenames: r.deceased.forenames,
    surname: r.deceased.surname,
    dateOfDeath: r.deceased.dateOfDeath,
    deathplace: r.deceased.deathplace,
    sex: r.deceased.sex,
    age: Number(r.deceased.age),
    occupation: r.deceased.occupation,
    causeOfDeath: r.deceased.causeOfDeath
  }
});

const processMarriageRecord = r => ({
  id: Number(r.id),
  date: r.date,
  dateOfMarriage: r.dateOfMarriage,
  registrar: {
    district: r.registrar.district,
    administrativeArea: r.registrar.administrativeArea
  },
  bride: {
    forenames: r.bride.forenames,
    surname: r.bride.surname
  },
  groom: {
    forenames: r.groom.forenames,
    surname: r.groom.surname
  }
});

const responseHandler = (resolve, reject) => (err, res, body) => {
  if (err) {
    reject(err);
  } else if (res.statusCode !== 200) {
    const name = statusToName[res.statusCode];
    const statusError = new Error(`Received status code "${res.statusCode}" from API with body:\n${body}`);

    statusError.name = name;

    reject(statusError);
  } else {
    try {
      resolve(JSON.parse(body));
    } catch (error) {
      reject(error);
    }
  }
};

module.exports = {
  buildQueryUri: buildQueryUri,
  processRecord: processRecord,
  processDeathRecord: processDeathRecord,
  processMarriageRecord: processMarriageRecord,
  refer: refer,
  reformatDate: reformatDate,
  responseHandler: responseHandler,
  toBritishDateFormat: toBritishDateFormat,
  toInternationalDateFormat: toInternationalDateFormat
};
