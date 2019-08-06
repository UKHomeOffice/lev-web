'use strict';

// Used for tests where multiple records are returned
module.exports = {
  id: 999999901,
  date: '10/10/2014',
  entryNumber: 1,
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
    surname: 'MULTIPLE',
    maidenSurname: 'TESTER',
    dateOfBirth: '01/01/1910',
    dateOfDeath: '01/01/2010',
    ageAtDeath: '100 years',
    birthplace: 'Test address',
    deathplace: 'Test address',
    sex: 'Male',
    address: '1 Test street',
    occupation: 'Unemployed',
    causeOfDeath: 'Old age',
    certifiedBy: 'A. Doctor MD'
  },
  status: {
    blocked: false
  }
};
