'use strict';

const _ = require('lodash');
const conf = require('../config');

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
  },
  showFullDetails: ri => !!ri.roles.filter(r => r === conf.fullDetailsRoleName).length
};
