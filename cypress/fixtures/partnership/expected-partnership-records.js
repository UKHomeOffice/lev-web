const search = {
  systemNumber: '',
  forenames: 'Test',
  surname: 'BRIDE',
  dop: '29/02/2012',
};

const result = {
  id: 999999901,
  date: "10/10/2014",
  dateOfPartnership: "29/02/2012",
  placeOfPartnership: {
    address: "Test place",
    short: "Test place"
  },
  registrar: {
    signature: "A. Registrar"
  },
  partner1: {
    prefix: "Mr",
    forenames: "Tester One",
    surname: "MULTIPLE",
    suffix: "I",
    dob: "29/02/1912",
    sex: "Female",
    occupation: "Unemployed",
    retired: false,
    address: "1 Test street",
    aliases: [
      {
        prefix: "Mr",
        forenames: "Test Previous",
        surname: "Smithers",
        suffix: "I"
      },
      {
        prefix: "Mr",
        forenames: "Testy Previous",
        surname: "Smithers",
        suffix: "I"
      }
    ],
    signature: "T.1. Multiple",
    condition: "Single"
  },
  partner2: {
    prefix: "Miss",
    forenames: "Test",
    surname: "BRIDE",
    suffix: "I",
    dob: "08/08/2008",
    sex: "Female",
    occupation: "Bride",
    retired: false,
    address: "10 Downing Street, Westminster, London, Greater London, W1 1MP",
    aliases: [
      {
        prefix: "Ms",
        forenames: "Test Previous",
        surname: "Smithers",
        suffix: "I"
      },
      {
        prefix: "Ms",
        forenames: "Testy Previous",
        surname: "Smithers",
        suffix: "I"
      }
    ],
    signature: "T. Bride",
    condition: "Single"
  },
  fatherOfPartner1: {
    forenames: "Test Fop1",
    surname: "FATHER",
    occupation: "Father",
    retired: true,
    designation: "Step father",
    deceased: true
  },
  motherOfPartner1: {
    forenames: "Serah Mop1",
    surname: "MOTHER",
    occupation: "Mother",
    retired: true,
    designation: "Mother",
    deceased: true
  },
  fatherOfPartner2: {
    forenames: "Test Fop2",
    surname: "FATHER",
    occupation: "Father",
    retired: true,
    designation: "Adoptive father",
    deceased: true
  },
  motherOfPartner2: {
    forenames: "Serah Mop2",
    surname: "MOTHER",
    occupation: "Mother",
    retired: true,
    designation: "Adoptive Mother",
    deceased: true
  },
  witness1: {
    forename: "Archy",
    surname: "Witness"
  },
  witness2: {
    forename: "Astrid",
    surname: "Other"
  },
  status: {
    blocked: false,
    marginalNotes: null
  },
  nextRegistration: null,
  previousRegistration: null
}

module.exports = {
  result,
  search
};
