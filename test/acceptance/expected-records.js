'use strict';

// Used for tests where multiple records are returned
module.exports = {
  'administrativeArea': 'Reading',
  'subDistrict': 'Test Subdistrict',
  'registrationDistrict': 'Test District',
  'child': {
    'name': {
      'givenName': 'Tester',
      'surname': 'Multiple',
      'fullName': 'Tester One Multiple'
    },
    'dateOfBirth': '01/01/2010',
    'sex': 'Male',
    'birthplace': 'Test Address'
  },
  'father': {
    'name': {
      'givenName': 'Dad One',
      'surname': 'Multiple',
      'fullName': 'Dad One Multiple'
    },
    'birthplace': 'Test Birthplace'
  },
  'mother': {
    'name': {
      'givenName': 'Mum One',
      'surname': 'Multiple',
      'fullName': 'Mum One Multiple'
    },
    'birthplace': 'Test Birthplace',
    'maidenSurname': 'prev-Multiple',
    'marriageSurname': 'prev-M-Multiple'
  },
  'systemNumber': 999999901,
  'date': '10/10/2014'
};
