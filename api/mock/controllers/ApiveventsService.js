'use strict';

exports.getEvents = function(args, res, next) {
  /**
   * parameters expected in the args:
   * lastname (String)
   * forenames (String)
   * forename1 (String)
   * forename2 (String)
   * forename3 (String)
   * forename4 (String)
   * dateofbirth (Date)
   * gender (String)
   **/

var examples = {};
  
  examples['application/json'] = [ {
  "id" : 123,
  "status" : {
    "fictitiousBirth" : true,
    "reRegistered" : "None",
    "cautionMark" : true,
    "cancelled" : true,
    "blockedRegistration" : true,
    "courtOrder" : "None"
  },
  "subjects" : {
    "child" : {
      "dateOfBirth" : "2008-08-08",
      "sex" : "Indeterminate",
      "birthplace" : "Kensington",
      "name" : {
        "surname" : "Smith",
        "qualifier" : "generated from prepending forename to surname",
        "fullName" : "Joan Narcissus Ouroboros Smith",
        "givenName" : "Joan Narcissus Ouroboros"
      },
      "nameAfterRegistration" : "Joan Narcissus Ouroboros Smith"
    },
    "mother" : {
      "occupation" : "Carpenter",
      "maidenSurname" : "Black",
      "birthplace" : "Kensington",
      "name" : "",
      "marriageSurname" : "White",
      "usualAddress" : "34 Matriarchs Place, Mumstown, Mumford"
    },
    "informant" : {
      "qualification" : "Mother",
      "name" : "",
      "usualAddress" : "34 Matriarchs Place, Mumstown, Mumford",
      "signature" : "J. Smith"
    },
    "father" : {
      "occupation" : "Carpenter",
      "birthplace" : "Kensington",
      "name" : ""
    }
  },
  "location" : {
    "registrationDistrict" : "Manchester",
    "subDistrict" : "Manchester",
    "name" : "Manchester, Manchester, Metropolitan District of Manchester",
    "administrativeArea" : "Metropolitan District of Manchester",
    "nameQualifier" : "generated by concatenating registrationDistrict, subDistrict and administrativeArea"
  },
  "registrarSignature" : "J. Smith",
  "type" : "birth",
  "date" : "2008-08-09",
  "systemNumber" : 123
} ];
  

  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}
exports.getEvent = function(args, res, next) {
  /**
   * parameters expected in the args:
   * id (String)
   **/

var examples = {};
  
  examples['application/json'] = {
  "id" : 123,
  "status" : {
    "fictitiousBirth" : true,
    "reRegistered" : "None",
    "cautionMark" : true,
    "cancelled" : true,
    "blockedRegistration" : true,
    "courtOrder" : "None"
  },
  "subjects" : {
    "child" : {
      "dateOfBirth" : "2008-08-08",
      "sex" : "Indeterminate",
      "birthplace" : "Kensington",
      "name" : {
        "surname" : "Smith",
        "qualifier" : "generated from prepending forename to surname",
        "fullName" : "Joan Narcissus Ouroboros Smith",
        "givenName" : "Joan Narcissus Ouroboros"
      },
      "nameAfterRegistration" : "Joan Narcissus Ouroboros Smith"
    },
    "mother" : {
      "occupation" : "Carpenter",
      "maidenSurname" : "Black",
      "birthplace" : "Kensington",
      "name" : "",
      "marriageSurname" : "White",
      "usualAddress" : "34 Matriarchs Place, Mumstown, Mumford"
    },
    "informant" : {
      "qualification" : "Mother",
      "name" : "",
      "usualAddress" : "34 Matriarchs Place, Mumstown, Mumford",
      "signature" : "J. Smith"
    },
    "father" : {
      "occupation" : "Carpenter",
      "birthplace" : "Kensington",
      "name" : ""
    }
  },
  "location" : {
    "registrationDistrict" : "Manchester",
    "subDistrict" : "Manchester",
    "name" : "Manchester, Manchester, Metropolitan District of Manchester",
    "administrativeArea" : "Metropolitan District of Manchester",
    "nameQualifier" : "generated by concatenating registrationDistrict, subDistrict and administrativeArea"
  },
  "registrarSignature" : "J. Smith",
  "type" : "birth",
  "date" : "2008-08-09",
  "systemNumber" : 123
};
  

  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}