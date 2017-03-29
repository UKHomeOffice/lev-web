'use strict';

const moment = require('moment');
require('moment-round');
const _ = require('lodash');

const parseDate = date => moment(date, /^\d{6,8}$/.test(date) ? 'DDMMYYYY' : 'DD/MM/YYYY');

const britishDate = function britishDate(value) {
  return value === ''
    || (this.regex(value, /^\d{1,2}\/\d{1,2}\/(?:\d\d){1,2}$/) && moment(value, 'DD/MM/YYYY').isValid())
    || (this.regex(value, /^(?:\d\d){3,4}$/) && moment(value, 'DDMMYYYY').isValid());
};

const past = value => value === ''
  || parseDate(value).isBefore(moment().ceil(24, 'hours'));

const since = (value, epoc) => value === ''
  || moment(value, /^\d{6,8}$/.test(value) ? 'DDMMYYYY' : 'DD/MM/YYYY').isSameOrAfter(moment(epoc).floor(24, 'hours'));

const emailChars = function emailChars(value) {
  return value === '' || this.regex(value, /^[a-z0-9._%+@-]+$/i);
};

const addValidators = validators => _.extend(validators, {
  'british-date': britishDate.bind(validators),
  'past': past,
  'since': since,
  'email-chars': emailChars.bind(validators)
});

module.exports = {
  addValidators: addValidators,
  parseDate: parseDate
};
