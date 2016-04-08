'use strict';

var _ = require('underscore');
var config = require('../config');
var request = require('request');
var querystring = require('querystring');
var moment = require('moment');

module.exports = {

  read: function read(attrs) {

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

    return new Promise(function returnRecords(resolve, reject) {

      var endpoint = 'http://' + config.api.host + ':' + config.api.port +
                     '/api/v0/events/birth';
      var params = {};
      var formatDate = function formatDate(date) {
        return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      };

      var ajaxGet = function ajaxGet(url, callback) {
        request.get(url, function requestGet(err, res, body) {
          var statusToName;
          var statusError;
          var data;

          if (err) {
            return reject(err);
          } else if (res.statusCode !== 200) {
            statusToName = {
              404: 'NotFoundError'
            };

            statusError = new Error('Received status code "' + res.statusCode + '" from API');

            if (statusToName[res.statusCode]) {
              statusError.name = statusToName[res.statusCode];
            }

            return reject(statusError);
          } else {
            try {
              return resolve({records: callback(JSON.parse(body))});
            } catch (error) {
              return reject(error);
            }
          }
        });
      };

      if (attrs['system-number']) {
        ajaxGet(endpoint + '/' + attrs['system-number'],
          function singleRecord(data) {
            return [processRecord(data)];
          });
      } else {
        if (attrs.surname) {
          params.lastname = attrs.surname;
        }

        if (attrs.forenames) {
          params.forenames = attrs.forenames;
        }

        if (attrs.dob) {
          params.dateofbirth = formatDate(attrs.dob);
        }

        ajaxGet(endpoint + '?' + querystring.stringify(params),
          function multipleRecords(data) {
            return _.map(data, processRecord);
          });
      }

    }.bind(this));

  }

};
