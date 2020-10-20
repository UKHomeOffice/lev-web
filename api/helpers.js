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
  date: attrs.dobd && toInternationalDateFormat(attrs.dobd)
}, _.identity);
const buildMarriageParams = (attrs) => _.pickBy({
  surname: attrs.surname,
  forenames: attrs.forenames,
  dateOfMarriage: attrs.dom && toInternationalDateFormat(attrs.dom)
}, _.identity);
const buildPartnershipParams = (attrs) => _.pickBy({
  surname: attrs.surname,
  forenames: attrs.forenames,
  dateOfPartnership: attrs.dop && toInternationalDateFormat(attrs.dop)
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
  } else if (endpoint.match('partnership')) {
    return endpoint + '?' + querystring.stringify(buildPartnershipParams(attrs));
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
      corrected: record.status.correction && record.status.correction !== 'None',
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

const processDeathRecord = r => {
  const blocked = r.status.blocked !== false;
  const block = blocked ? () => 'UNAVAILABLE' : value => value;

  return {
    id: Number(r.id),
    date: block(toBritishDateFormat(r.date)),
    entryNumber: block(r.entryNumber),
    registrar: {
      signature: block(r.registrar.signature),
      designation: block(r.registrar.designation),
      subdistrict: block(r.registrar.subdistrict),
      district: block(r.registrar.district),
      administrativeArea: block(r.registrar.administrativeArea)
    },
    informant: {
      forenames: block(r.informant.forenames),
      surname: block(r.informant.surname),
      address: block(r.informant.address),
      qualification: block(r.informant.qualification),
      signature: block(r.informant.signature)
    },
    deceased: {
      forenames: block(r.deceased.forenames),
      surname: block(r.deceased.surname),
      maidenSurname: block(r.deceased.maidenSurname),
      dateOfBirth: block(toBritishDateFormat(r.deceased.dateOfBirth)),
      dateOfDeath: block(toBritishDateFormat(r.deceased.dateOfDeath)),
      dateOfDeathQualifier: block(r.deceased.dateOfDeathQualifier),
      birthplace: block(r.deceased.birthplace),
      deathplace: block(r.deceased.deathplace),
      ageAtDeath: block(r.deceased.ageAtDeath),
      sex: block(r.deceased.sex),
      address: block(r.deceased.address),
      occupation: block(r.deceased.occupation),
      retired: blocked ? false : r.deceased.retired,
      causeOfDeath: block(r.deceased.causeOfDeath),
      certifiedBy: block(r.deceased.certifiedBy),
      relationshipToPartner: block(r.deceased.relationshipToPartner),
      aliases: blocked ? [] : r.deceased.aliases
    },
    partner: {
      name: block(r.partner.name),
      occupation: block(r.partner.occupation),
      retired: block(r.partner.retired)
    },
    mother: {
      name: block(r.mother.name),
      occupation: block(r.mother.occupation)
    },
    father: {
      name: block(r.father.name),
      occupation: block(r.father.occupation)
    },
    coroner: {
      name: block(r.coroner.name),
      designation: block(r.coroner.designation),
      area: block(r.coroner.area)
    },
    inquestDate: block(r.inquestDate),
    status: {
      refer: blocked || (r.status.marginalNote && r.status.marginalNote !== 'None'),
      corrected: r.status.correction && r.status.correction !== 'None'
    },
    previousRegistration: blocked ? {
      date: null,
      systemNumber: null
    } : {
      date: r.previousRegistration && r.previousRegistration.date,
      systemNumber: r.previousRegistration && r.previousRegistration.id
    },
    nextRegistration: blocked ? {
      date: null,
      systemNumber: null
    } : {
      date: r.nextRegistration && r.nextRegistration.date,
      systemNumber: r.nextRegistration && r.nextRegistration.id
    }
  };
};

const processMarriageRecord = r => {
  const blocked = r.status.blocked !== false;
  const block = blocked ? () => 'UNAVAILABLE' : value => value;

  return {
    id: Number(r.id),
    entryNumber: block(r.entryNumber),
    dateOfMarriage: block(toBritishDateFormat(r.dateOfMarriage)),
    placeOfMarriage: {
      address: block(r.placeOfMarriage.address),
      parish: block(r.placeOfMarriage.parish),
      short: block(r.placeOfMarriage.short)
    },
    registrar: {
      signature: block(r.registrar.signature),
      designation: block(r.registrar.designation),
      superintendentSignature: block(r.registrar.superintendentSignature),
      superintendentDesignation: block(r.registrar.superintendentDesignation),
      district: block(r.registrar.district),
      administrativeArea: block(r.registrar.administrativeArea)
    },
    groom: {
      forenames: block(r.groom.forenames),
      surname: block(r.groom.surname),
      age: block(Number(r.groom.age)),
      occupation: block(r.groom.occupation),
      retired: block(r.groom.retired),
      address: block(r.groom.address),
      condition: block(r.groom.condition),
      signature: block(r.groom.signature)
    },
    bride: {
      forenames: block(r.bride.forenames),
      surname: block(r.bride.surname),
      age: block(Number(r.bride.age)),
      occupation: block(r.bride.occupation),
      retired: block(r.bride.retired),
      address: block(r.bride.address),
      condition: block(r.bride.condition),
      signature: block(r.bride.signature)
    },
    fatherOfGroom: {
      forenames: block(r.fatherOfGroom.forenames),
      surname: block(r.fatherOfGroom.surname),
      occupation: block(r.fatherOfGroom.occupation),
      retired: block(r.fatherOfGroom.retired),
      designation: block(r.fatherOfGroom.designation),
      deceased: block(r.fatherOfGroom.deceased)
    },
    fatherOfBride: {
      forenames: block(r.fatherOfBride.forenames),
      surname: block(r.fatherOfBride.surname),
      occupation: block(r.fatherOfBride.occupation),
      retired: block(r.fatherOfBride.retired),
      designation: block(r.fatherOfBride.designation),
      deceased: block(r.fatherOfBride.deceased)
    },
    witness1: {
      signature: block(r.witness1.signature)
    },
    witness2: {
      signature: block(r.witness2.signature)
    },
    witness3: {
      signature: block(r.witness3.signature)
    },
    witness4: {
      signature: block(r.witness4.signature)
    },
    witness5: {
      signature: block(r.witness5.signature)
    },
    witness6: {
      signature: block(r.witness6.signature)
    },
    witness7: {
      signature: block(r.witness7.signature)
    },
    witness8: {
      signature: block(r.witness8.signature)
    },
    witness9: {
      signature: block(r.witness9.signature)
    },
    witness10: {
      signature: block(r.witness10.signature)
    },
    status: {
      refer: blocked || (r.status.marginalNote && r.status.marginalNote !== 'None')
    },
    previousRegistration: blocked ? {
      systemNumber: null
    } : {
      systemNumber: r.previousRegistration && r.previousRegistration.id
    },
    nextRegistration: blocked ? {
      systemNumber: null
    } : {
      systemNumber: r.nextRegistration && r.nextRegistration.id
    }
  };
};

const processPartnershipRecord = r => {
  const blocked = r.status.blocked !== false;
  const block = blocked ? () => 'UNAVAILABLE' : value => value;

  return {
    id: Number(r.id),
    dateOfPartnership: block(toBritishDateFormat(r.dateOfPartnership)),
    placeOfPartnership: {
      address: block(r.placeOfPartnership.address),
      short: block(r.placeOfPartnership.short)
    },
    registrar: {
      signature: block(r.registrar.signature)
    },
    partner1: {
      prefix: r.partner1.prefix,
      forenames: block(r.partner1.forenames),
      surname: block(r.partner1.surname),
      suffix: r.partner1.suffix,
      dob: block(toBritishDateFormat(r.partner1.dob)),
      sex: block(r.partner1.sex),
      occupation: block(r.partner1.occupation),
      retired: block(r.partner1.retired),
      address: block(r.partner1.address),
      aliases: blocked ? [] : r.partner1.aliases,
      condition: block(r.partner1.condition),
      signature: block(r.partner1.signature)
    },
    partner2: {
      prefix: block(r.partner2.prefix),
      forenames: block(r.partner2.forenames),
      surname: block(r.partner2.surname),
      suffix: block(r.partner2.suffix),
      dob: block(toBritishDateFormat(r.partner2.dob)),
      sex: block(r.partner2.sex),
      occupation: block(r.partner2.occupation),
      retired: block(r.partner2.retired),
      address: block(r.partner2.address),
      aliases: blocked ? [] : r.partner2.aliases,
      condition: block(r.partner2.condition),
      signature: block(r.partner2.signature)
    },
    fatherOfPartner1: {
      forenames: block(r.fatherOfPartner1.forenames),
      surname: block(r.fatherOfPartner1.surname),
      occupation: block(r.fatherOfPartner1.occupation),
      retired: block(r.fatherOfPartner1.retired),
      designation: block(r.fatherOfPartner1.designation),
      deceased: block(r.fatherOfPartner1.deceased)
    },
    fatherOfPartner2: {
      forenames: block(r.fatherOfPartner2.forenames),
      surname: block(r.fatherOfPartner2.surname),
      occupation: block(r.fatherOfPartner2.occupation),
      retired: block(r.fatherOfPartner2.retired),
      designation: block(r.fatherOfPartner2.designation),
      deceased: block(r.fatherOfPartner2.deceased)
    },
    motherOfPartner1: {
      forenames: block(r.motherOfPartner1.forenames),
      surname: block(r.motherOfPartner1.surname),
      occupation: block(r.motherOfPartner1.occupation),
      retired: block(r.motherOfPartner1.retired),
      designation: block(r.motherOfPartner1.designation),
      deceased: block(r.motherOfPartner1.deceased)
    },
    motherOfPartner2: {
      forenames: block(r.motherOfPartner2.forenames),
      surname: block(r.motherOfPartner2.surname),
      occupation: block(r.motherOfPartner2.occupation),
      retired: block(r.motherOfPartner2.retired),
      designation: block(r.motherOfPartner2.designation),
      deceased: block(r.motherOfPartner2.deceased)
    },
    witness1: {
      forename: block(r.witness1.forename),
      surname: block(r.witness1.surname)
    },
    witness2: {
      forename: block(r.witness2.forename),
      surname: block(r.witness2.surname)
    },
    status: {
      refer: blocked || (r.status.marginalNote && r.status.marginalNote !== 'None')
    },
    previousRegistration: blocked ? {
      systemNumber: null
    } : {
      systemNumber: r.previousRegistration && r.previousRegistration.id
    },
    nextRegistration: blocked ? {
      systemNumber: null
    } : {
      systemNumber: r.nextRegistration && r.nextRegistration.id
    }
  };
};

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
  processPartnershipRecord: processPartnershipRecord,
  refer: refer,
  reformatDate: reformatDate,
  responseHandler: responseHandler,
  toBritishDateFormat: toBritishDateFormat,
  toInternationalDateFormat: toInternationalDateFormat
};
