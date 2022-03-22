'use strict';

const search = {
  systemNumber: '',
  forenames: 'Tester',
  surname: 'SOLO',
  dom: '29/02/2012',
};

// Used for test where only one record should be returned
const result = {
  id: 999999910,
  date: '10/10/2014',
  entryNumber: 10,
  dateOfMarriage: '29/02/2012',
  placeOfMarriage: {
    address: 'Test place',
    short: 'Test place'
  },
  registrar: {
    signature: 'A. Registrar',
    designation: 'Registrar',
    superintendentSignature: 'A. Super-Reg',
    superintendentDesignation: 'Superintendent Registrar',
    district: 'Test Subdistrict',
    administrativeArea: 'Reading'
  },
  groom: {
    forenames: 'Tester',
    surname: 'SOLO',
    age: 100,
    occupation: 'Unemployed',
    retired: false,
    address: '10 Test street',
    condition: 'Single',
    signature: 'T. Solo'
  },
  bride: {
    forenames: 'Test',
    surname: 'BRIDE',
    age: 18,
    occupation: 'Bride',
    retired: false,
    address: '10 Test street',
    condition: 'Single',
    signature: 'T. Bride'
  },
  fatherOfGroom: {
    forenames: 'Test Fog',
    surname: 'FATHER',
    occupation: 'Father',
    retired: true,
    deceased: true
  },
  fatherOfBride: {
    forenames: 'Test Fob',
    surname: 'BRIDE',
    occupation: 'Father',
    retired: true,
    deceased: true
  },
  witness1: {
    signature: 'A. Witness'
  },
  witness2: {
    signature: 'A.N. Other'
  },
  witness3: {
  },
  witness4: {
  },
  witness5: {
  },
  witness6: {
  },
  witness7: {
  },
  witness8: {
  },
  witness9: {
  },
  witness10: {
  },
  minister1: {
    signature: 'A. Minister',
    designation: 'Reverend'
  },
  minister2: {
  },
  status: {
    blocked: false
  }
};

module.exports = {
  search,
  result
};
