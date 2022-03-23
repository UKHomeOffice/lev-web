'use strict';

const search = {
  systemNumber: '',
  forenames: 'Tester',
  surname: 'MULTIPLE',
  dom: '29/02/2012',
};

// Used for tests where multiple records are returned
const result1 = {
  id: 999999901,
  date: '10/10/2014',
  entryNumber: 1,
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
    forenames: 'Tester One',
    surname: 'MULTIPLE',
    age: 100,
    occupation: 'Unemployed',
    retired: false,
    address: '1 Test street',
    condition: 'Single',
    signature: 'T.1. Multiple'
  },
  bride: {
    forenames: 'Test',
    surname: 'BRIDE',
    age: 18,
    occupation: 'Bride',
    retired: false,
    address: '1 Test street',
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

const result2 = {
  ...result1,
  id: 999999902,
  entryNumber: 2,
  groom: {
    ...result1.groom,
    forenames: 'Tester Two',
    address: '2 Test street',
    signature: 'T.2. Multiple'
  },
  bride: {
    ...result1.bride,
    address: '2 Test street',
  }
};

const result3 = {
  ...result1,
  id: 999999903,
  entryNumber: 3,
  groom: {
    ...result1.groom,
    forenames: 'Tester Three',
    address: '3 Test street',
    signature: 'T.3. Multiple'
  },
  bride: {
    ...result1.bride,
    address: '3 Test street',
  }
};

module.exports = {
  search,
  results: [
    result1,
    result2,
    result3
  ].sort((a, b) => Cypress.env('e2e') ? `${a.groom.forenames} ${a.groom.surname}`.localeCompare(`${b.groom.forenames} ${b.groom.surname}`) : 0)
};
