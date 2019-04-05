'use strict';

module.exports = {
  'system-number': {
    validate: [
      'numeric',
      {
        type: 'exactlength',
        arguments: [9]
      }
    ]
  },
  'surname': {
    validate: ['required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  },
  'forenames': {
    validate: ['required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  },
  'dop': {
    validate: ['british-date', 'past', {
      type: 'since',
      arguments: [require('moment')('1/12/2005', 'DD/MM/YYYY')]
    }, 'required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  }
};
