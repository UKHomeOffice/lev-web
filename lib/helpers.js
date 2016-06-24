'use strict';

var _ = require('lodash');

module.exports = {
  serialize: function serialize(obj, prefix) {
    var str = [];
    obj = _.pickBy(obj, _.identity);
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + '[' + p + ']' : p;
        var v = obj[p];
        str.push(typeof v === 'object' ?
          serialize(v, k) :
          encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return str.join('&');
  }
};
