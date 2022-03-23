'use strict';

const search = {
  systemNumber: '',
  forenames: 'Tester',
  surname: 'SOLO',
  dop: '29/02/2012',
};

const result = {
  id: 999999910,
  date: '10/10/2014',
  dateOfPartnership: '29/02/2012',
  placeOfPartnership: { address: 'Test place', short: 'Test place' },
  registrar: { signature: 'A. Registrar' },
  partner1: {
    prefix: 'Mr',
    forenames: 'Tester',
    surname: 'SOLO',
    suffix: 'IV',
    dob: '29/02/1912',
    sex: 'Female',
    occupation: 'Unemployed',
    retired: false,
    address: '10 Test street',
    aliases: [
      {
        prefix: 'Mr',
        forenames: 'Test Previous',
        surname: 'Smithers',
        suffix: 'IV'
      },
      {
        prefix: 'Mr',
        forenames: 'Testy Previous',
        surname: 'Smithers',
        suffix: 'IV'
      }
    ],
    signature: 'T. Solo',
    condition: 'Single'
  },
  partner2: {
    prefix: 'Miss',
    forenames: 'Test',
    surname: 'BRIDE',
    suffix: 'IV',
    dob: '08/08/2008',
    sex: 'Female',
    occupation: 'Bride',
    retired: false,
    address: 'A dark dark flat in a dark dark house, down a dark dark street, in a dark dark town',
    aliases: [
      {
        prefix: 'Mr',
        forenames: 'Test Previous',
        surname: 'Smithers',
        suffix: 'IV'
      },
      {
        prefix: 'Mr',
        forenames: 'Testy Previous',
        surname: 'Smithers',
        suffix: 'IV'
      }
    ],
    signature: 'T. Bride',
    condition: 'Single'
  },
  fatherOfPartner1: {
    forenames: 'Test Fop1',
    surname: 'FATHER',
    occupation: 'Father',
    retired: true,
    designation: 'Step-father',
    deceased: true
  },
  motherOfPartner1: {
    forenames: 'Serah Mop1',
    surname: 'MOTHER',
    occupation: 'Mother',
    retired: true,
    designation: 'Stepmother',
    deceased: true
  },
  fatherOfPartner2: {
    forenames: 'Test Fop2',
    surname: 'FATHER',
    occupation: 'Father',
    retired: true,
    designation: 'Father',
    deceased: true
  },
  motherOfPartner2: {
    forenames: 'Serah Mop2',
    surname: 'MOTHER',
    occupation: 'Mother',
    retired: true,
    designation: 'Mother',
    deceased: true
  },
  witness1: { forename: 'Arthur', surname: 'Witness' },
  witness2: { forename: 'Abernathy', surname: 'Other' },
  status: { blocked: false, marginalNotes: null },
  nextRegistration: null,
  previousRegistration: null
};


module.exports = {
  result,
  search
};
