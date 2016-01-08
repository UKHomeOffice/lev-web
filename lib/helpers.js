'use strict';

var _ = require('underscore');

module.exports = {
  serialize: function serialize(obj, prefix) {
    var str = [];
    obj = _.pick(obj, _.identity);
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
