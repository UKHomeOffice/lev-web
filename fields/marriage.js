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
    validate: ['british-date', 'past', 'required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  }
};
