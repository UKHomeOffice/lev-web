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
  'dob': {
    validate: ['british-date', 'past', {
      type: 'since',
      arguments: [require('moment')('1/7/2009', 'DD/MM/YYYY')]
    }],
    dependent: {
      value: '',
      field: 'system-number'
    }
  }
};
