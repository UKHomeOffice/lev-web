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
        'system-number': record.id,
        surname: record.subjects.child.name.surname,
        forenames: record.subjects.child.name.givenName,
        dob: formatDate(record.subjects.child.dateOfBirth),
        gender: record.subjects.child.gender,
        'birth-place': record.location.name,
        mother: {
          name: record.subjects.parent1.name.fullName,
          nee: 'Alice*',
          'birth-place': 'Manchester*',
          occupation: 'Engineer*'
        },
        father: {
          name: record.subjects.parent2.name.fullName,
          'birth-place': 'Croydon*',
          occupation: 'Self-employed*'
        },
        registered: {
          jointly: 'No*',
          district: 'Norfolk*',
          'sub-district': 'Norwich*',
          'admin-area': 'Norfolk*',
          // Note: The API incorrectly returns the DoB in record.date
          date: formatDate('2008-08-09') + '*'
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
            reject(err);
          } else if (res.statusCode !== 200) {
            statusToName = {
              404: 'NotFoundError'
            };

            statusError = new Error('Received status code "' + res.statusCode + '" from API');

            if (statusToName[res.statusCode]) {
              statusError.name = statusToName[res.statusCode];
            }

            reject(statusError);
          } else {
            try {
              data = JSON.parse(body);
            } catch (error) {
              reject(error);
            }

            if (!data) {
              reject(new Error('Empty response from API'));
            } else {
              resolve({records: callback(data)});
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
          function singleRecord(data) {
            return _.map(data, processRecord);
          });
      }

    }.bind(this));

  }

};
