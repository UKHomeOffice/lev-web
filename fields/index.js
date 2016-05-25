'use strict';

module.exports = {
  'system-number': {
    validate: ['required', 'numeric'],
    dependent: {
      value: '',
      field: 'surname'
    }
  },
  'surname': {
    validate: ['required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  },
  'forenames': {
  },
  'dob': {
    validate: ['british-date'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  }
}
