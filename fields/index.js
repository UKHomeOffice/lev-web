'use strict';

module.exports = {
  'system-number': {
    validate: ['numeric'],
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
    validate: ['required'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  },
  'dob': {
    validate: ['british-date'],
    dependent: {
      value: '',
      field: 'system-number'
    }
  }
};
