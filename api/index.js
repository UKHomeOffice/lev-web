'use strict';

var _ = require('underscore');
var stubs = require('./stubs');

module.exports = {

  read: function read(attrs) {

    return new Promise(function returnRecords(resolve, reject) {

      var records = _.filter(stubs, function (data) {
        return _.every(data, function (value, id) {
          if (!attrs[id]) {
            return true;
          }
          return value.toLowerCase().indexOf(attrs[id].toLowerCase()) !== -1;
        });
      });

      if (records) {
        resolve({records: records});
      } else {
        reject(new Error('No records available'));
      }

    }.bind(this));

  }

};
