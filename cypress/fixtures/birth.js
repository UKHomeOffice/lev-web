'use strict';

module.exports = {
  // Used for test where only one record should be returned
  validRecord: {
    'administrativeArea': 'Reading',
    'subDistrict': 'Test Subdistrict',
    'registrationDistrict': 'Test District',
    'child': {
      'name': {
        'givenName': 'Tester',
        'surname': 'Solo',
        'fullName': 'Tester Solo'
      },
      'dateOfBirth': '29/02/2012',
      'sex': 'Male',
      'birthplace': 'Test Address'
    },
    'father': {
      'name': {
        'givenName': 'Dad',
        'surname': 'Solo',
        'fullName': 'Dad Solo'
      },
      'birthplace': 'Test Birthplace'
    },
    'mother': {
      'name': {
        'givenName': 'Mum',
        'surname': 'Solo',
        'fullName': 'Mum Solo'
      },
      'birthplace': 'Test Birthplace',
      'maidenSurname': 'prev-Solo',
      'marriageSurname': 'prev-M-Solo'
    },
    'systemNumber': 999999910,
    'date': '10/10/2014'
  },
  // Used for test where multiple records should be returned
  multipleValidRecords: {
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
  }
};

