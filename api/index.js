'use strict';

var _ = require('underscore');
var config = require('../config');
var request = require('request');
var requestWithOAuth2 = require('../lib/requestWithOAuth2');
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

  return {
    'system-number': record.systemNumber,
    surname: record.subjects.child.name.surname,
    forenames: record.subjects.child.name.givenName,
    dob: formatDate(record.subjects.child.dateOfBirth),
    gender: record.subjects.child.sex,
    'birth-place': record.status.blockedRegistration ? 'UNAVAILABLE' : record.subjects.child.birthplace,
    mother: record.status.blockedRegistration ? {
      name: 'UNAVAILABLE',
      nee: 'UNAVAILABLE',
      'birth-place': 'UNAVAILABLE',
      occupation: 'UNAVAILABLE'
    } : {
      name: record.subjects.mother.name.fullName,
      nee: record.subjects.mother.maidenSurname,
      'birth-place': record.subjects.mother.birthplace,
      occupation: record.subjects.mother.occupation
    },
    father: record.status.blockedRegistration ? {
      name: 'UNAVAILABLE',
      'birth-place': 'UNAVAILABLE',
      occupation: 'UNAVAILABLE'
    } : {
      name: record.subjects.father.name.fullName,
      'birth-place': record.subjects.father.birthplace,
      occupation: record.subjects.father.occupation
    },
    registered: record.status.blockedRegistration ? {
      jointly: 'UNAVAILABLE',
      district: 'UNAVAILABLE',
      'sub-district': 'UNAVAILABLE',
      'admin-area': 'UNAVAILABLE',
      date: 'UNAVAILABLE'
    } : {
      jointly: record.subjects.informant.qualification === 'Father, Mother' ? 'Yes' : 'No',
      district: record.location.registrationDistrict,
      'sub-district': record.location.subDistrict,
      'admin-area': record.location.administrativeArea,
      date: formatDate(record.date)
    },
    status: {
      blockedRegistration: record.status.blockedRegistration,
      cancelled: record.status.cancelled,
      cautionMark: record.status.cautionMark,
      courtOrder: (record.status.courtOrder === 'None') ? '' : record.status.courtOrder,
      fictitiousBirth: record.status.fictitiousBirth,
      reRegistered: (record.status.reRegistered === 'None') ? '' : record.status.reRegistered
    },
    previousRegistration: record.status.blockedRegistration ? {
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

var requestData = function requestData(url, callback) {
  return new Promise(function requestDataPromise(resolve, reject) {
    return requestWithOAuth2.get(url, oauthUrl, clientId, clientSecret, oAuthUsername, oAuthPassword,
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
  read: function read(attrs) {
    var r;

    attrs = attrs || {};

    if (attrs['system-number']) {
      r = this.requestID(attrs['system-number'])
        .then(function wrapInArray(data) {
          return [data];
        });
    } else {
      r = this.query(attrs);
    }

    return r;
  },

  requestID: function requestID(id) {
    return requestData(endpoint + '/' + id,
      function singleRecord(data) {
        return processRecord(data);
      });
  },

  query: function query(attrs) {
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

    return requestData(endpoint + '?' + querystring.stringify(params),
      function multipleRecords(data) {
        return _.map(data, processRecord);
      });
  }
};
