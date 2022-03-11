'use strict';

const search = {
  systemNumber: '',
  forenames: 'Tester',
  surname: 'SOLO',
  dobd: '29/02/2012',
};

// Used for test where only one record should be returned
const result = {
  id: 999999910,
  date: '10/10/2014',
  entryNumber: 10,
  registrar: {
    signature: 'A. Registrar',
    designation: 'Registrar',
    subdistrict: 'Test Subdistrict',
    district: 'Test District',
    administrativeArea: 'Reading'
  },
  informant: {
    forenames: 'Informy',
    surname: 'McInformface',
    address: '666 Inform House, 6 Inform street, Informington, Informshire',
    qualification: 'Life-long nemesis, Present at death',
    signature: 'I. McInformface'
  },
  deceased: {
    forenames: 'Tester',
    surname: 'SOLO',
    maidenSurname: 'TESTER',
    dateOfBirth: '29/02/1912',
    dateOfDeath: '29/02/2012',
    ageAtDeath: '100 years',
    birthplace: 'Test address',
    deathplace: 'Test address',
    sex: 'Male',
    address: '10 Test street',
    occupation: 'Unemployed',
    causeOfDeath: 'Old age',
    certifiedBy: 'A. Doctor MD'
  },
  status: {
    blocked: false
  }
};

module.exports = {
  search,
  result
};
