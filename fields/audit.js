'use strict';

module.exports = {
  'from': {
    validate: ['british-date', 'past', 'required']
  },
  'to': {
    validate: ['british-date', 'required']
  }
};
