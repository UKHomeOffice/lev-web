'use strict';

var Model = module.exports = function Model(attrs) {
  this.attributes = attrs;
};

Model.prototype.get = function getRecords() {
  return new Promise(function returnRecords(resolve, reject) {
    if (typeof resolve === 'function') {
      resolve({
        records: [{
          forenames: 'John',
          surname: 'Adams'
        }]
      });
    } else {
      reject(new Error('BIG ERROR'));
    }
  });
};
