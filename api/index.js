'use strict';

var _ = require('lodash');
var config = require('../config');
var levRequest = require('../lib/lev-request');
var querystring = require('querystring');
var moment = require('moment');

var oauthUrl;
var clientId;
var clientSecret;
var oAuthUsername;
var oAuthPassword;
if (config.oauth) {
  oauthUrl = config.oauth.oauthUrl;
  clientId = config.oauth.clientId;
  clientSecret = config.oauth.clientSecret;
  oAuthUsername = config.oauth.username;
  oAuthPassword = config.oauth.password;
}

var formatDate = function formatDate(date) {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
};

var refer = function refer(record) {
  return (
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
};

var processRecord = function processRecord(record) {
  let blocked = record.status.blockedRegistration !== false;
  let block = blocked ? () => 'UNAVAILABLE' : value => value;
  return {
    'system-number': record.systemNumber,
    surname: block(record.subjects.child.name.surname),
    forenames: block(record.subjects.child.name.givenName),
    dob: block(formatDate(record.subjects.child.dateOfBirth)),
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
      date: block(formatDate(record.date))
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

var endpoint = `${config.api.protocol}://${config.api.host}:${config.api.port}/api/v0/events/birth`;

var requestData = function requestData(url, user, callback) {
  return new Promise(function requestDataPromise(resolve, reject) {
    var headers = user ? { 'X-Auth-Downstream-Username': user } : {};
    return levRequest.get({
      'url': url,
      'headers': headers
    }, oauthUrl, clientId, clientSecret, oAuthUsername, oAuthPassword,
      function requestGet(err, res, body) {
      var statusToName;
      var statusError;
      var r;

      if (err) {
        return reject(err);
      } else if (res.statusCode !== 200) {
        statusToName = {
          404: 'NotFoundError',
          401: 'NotAuthorized'
        };

        statusError = new Error(`Received status code "${res.statusCode}" from API`);

        if (statusToName[res.statusCode]) {
          statusError.name = statusToName[res.statusCode];
        }

        r = reject(statusError);
      } else {
        try {
          r = resolve(callback(JSON.parse(body)));
        } catch (error) {
          r = reject(error);
        }
      }

      return r;
    });
  });
};

module.exports = {
  read: function read(attrs, user) {
    var r;

    attrs = attrs || {};

    if (attrs['system-number']) {
      r = this.requestID(attrs['system-number'], user)
        .then(function wrapInArray(data) {
          return [data];
        });
    } else {
      r = this.query(attrs, user);
    }

    return r;
  },

  requestID: function requestID(id, user) {
    return requestData(endpoint + '/' + id, user, function singleRecord(data) {
        return processRecord(data);
      });
  },

  query: function query(attrs, user) {
    var params = {};
    attrs = attrs || {};

    if (attrs.surname) {
      params.lastname = attrs.surname;
    }

    if (attrs.forenames) {
      params.forenames = attrs.forenames;
    }

    if (attrs.dob) {
      params.dateofbirth = moment(attrs.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    return requestData(endpoint + '?' + querystring.stringify(params), user,
      function multipleRecords(data) {
        return _.map(data, processRecord);
      });
  }
};
