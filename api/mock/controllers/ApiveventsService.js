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
  "id" : "123456789",
  "status" : {
    "fictitiousBirth" : "???",
    "cautionMark" : "???",
    "cancelled" : "???",
    "blockedRegistration" : "???"
  },
  "subjects" : {
    "child" : "",
    "parent1" : {
      "dateOfBirth" : "2008-08-08",
      "name" : {
        "surname" : "Smith",
        "qualifier" : "generated from prepending forename to surname",
        "fullName" : "Joan Narcissus Ouroboros Smith",
        "givenName" : "Joan Narcissus Ouroboros"
      },
      "gender" : "Indeterminate"
    },
    "parent2" : ""
  },
  "location" : {
    "name" : "Kensington"
  },
  "type" : "birth",
  "date" : "2008-08-09"
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
  "id" : "123456789",
  "status" : {
    "fictitiousBirth" : "???",
    "cautionMark" : "???",
    "cancelled" : "???",
    "blockedRegistration" : "???"
  },
  "subjects" : {
    "child" : "",
    "parent1" : {
      "dateOfBirth" : "2008-08-08",
      "name" : {
        "surname" : "Smith",
        "qualifier" : "generated from prepending forename to surname",
        "fullName" : "Joan Narcissus Ouroboros Smith",
        "givenName" : "Joan Narcissus Ouroboros"
      },
      "gender" : "Indeterminate"
    },
    "parent2" : ""
  },
  "location" : {
    "name" : "Kensington"
  },
  "type" : "birth",
  "date" : "2008-08-09"
};
  

  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}
