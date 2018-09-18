'use strict';

// Used for test where only one record should be returned
module.exports = {
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
    address: '666, Inform House, 6, Inform street, Informington, Informshire, IN7 0RM',
    qualification: 'Life-long nemesis, Present at death',
    signature: 'I. McInformface'
  },
  deceased: {
    forenames: 'Tester',
    surname: 'SOLO',
    dateOfBirth: '29/02/1912',
    dateOfDeath: '29/02/2012',
    birthplace: 'Test address',
    deathplace: 'Test address',
    sex: 'Male',
    address: '10, Test street',
    occupation: 'Unemployed',
    causeOfDeath: 'Old age',
    certifiedBy: 'A. Doctor MD'
  },
  status: {
    blocked: false
  }
};
