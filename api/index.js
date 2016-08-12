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

var processRecord = function processRecord(record) {
  var formatDate = function formatDate(date) {
    return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  };

  var blocked = record.status.blockedRegistration !== false;

  var refer = function refer() {
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

  return {
    'system-number': record.systemNumber,
    surname: blocked ? 'UNAVAILABLE' : record.subjects.child.name.surname,
    forenames: blocked ? 'UNAVAILABLE' : record.subjects.child.name.givenName,
    dob: blocked ? 'UNAVAILABLE' : formatDate(record.subjects.child.dateOfBirth),
    gender: blocked ? 'UNAVAILABLE' : record.subjects.child.sex,
    'birth-place': blocked ? 'UNAVAILABLE' : record.subjects.child.birthplace,
    mother: blocked ? {
      name: 'UNAVAILABLE',
      nee: 'UNAVAILABLE',
      marriageSurname: 'UNAVAILABLE',
      'birth-place': 'UNAVAILABLE',
      occupation: 'UNAVAILABLE'
    } : {
      name: record.subjects.mother.name.fullName,
      nee: record.subjects.mother.maidenSurname,
      marriageSurname: record.subjects.mother.marriageSurname,
      'birth-place': record.subjects.mother.birthplace,
      occupation: record.subjects.mother.occupation
    },
    father: blocked ? {
      name: 'UNAVAILABLE',
      'birth-place': 'UNAVAILABLE',
      occupation: 'UNAVAILABLE'
    } : {
      name: record.subjects.father.name.fullName,
      'birth-place': record.subjects.father.birthplace,
      occupation: record.subjects.father.occupation
    },
    registered: blocked ? {
      by: 'UNAVAILABLE',
      district: 'UNAVAILABLE',
      'sub-district': 'UNAVAILABLE',
      'admin-area': 'UNAVAILABLE',
      date: 'UNAVAILABLE'
    } : {
      by: record.subjects.informant.qualification,
      district: record.location.registrationDistrict,
      'sub-district': record.location.subDistrict,
      'admin-area': record.location.administrativeArea,
      date: formatDate(record.date)
    },
    status: blocked ? {
      refer: true
    } : {
      refer: refer(),
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

var endpoint = config.api.protocol + '://' +
               config.api.host + ':' + config.api.port +
               '/api/v0/events/birth';

var requestData = function requestData(url, user, callback) {
  return new Promise(function requestDataPromise(resolve, reject) {
    var headers = user ? {'X-Auth-Downstream-Username': user} : {};
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

        statusError = new Error('Received status code "' + res.statusCode + '" from API');

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
    var formatDate = function formatDate(date) {
      return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    };

    attrs = attrs || {};

    if (attrs.surname) {
      params.lastname = attrs.surname;
    }

    if (attrs.forenames) {
      params.forenames = attrs.forenames;
    }

    if (attrs.dob) {
      params.dateofbirth = formatDate(attrs.dob);
    }

    return requestData(endpoint + '?' + querystring.stringify(params), user,
      function multipleRecords(data) {
        return _.map(data, processRecord);
      });
  }
};
