'use strict';

const moment = require('moment');
require('moment-round');
const hof = require('../../../lib/hof-standalone');
const validators = require('../../../lib/custom-validators');
validators.addValidators(hof.validators);

describe('helper function', () => {

  describe('#parseDate', () => {
    it('should take a date in the standard form DD/MM/YYYY and return a "moment" object', () => {
      const now = moment();
      const today = validators.parseDate(now.format('DD/MM/YYYY'));
      expect(today).to.be.an.instanceOf(moment);
      expect(today.isSame(now.floor(24, 'hours'))).to.be.true;
    });
    it('should take a date in the standard form DDMMYYYY and return a "moment" object', () => {
      const now = moment();
      const today = validators.parseDate(now.format('DDMMYYYY'));
      expect(today).to.be.an.instanceOf(moment);
      expect(today.isSame(now.floor(24, 'hours'))).to.be.true;
    });
  });

  describe('#addValidators', () => {
    it('should add the custom validators to an existing set of validators', () => {
      const v8s = {};
      validators.addValidators(v8s).should.have.keys(['british-date', 'past', 'since', 'email-chars']);
      v8s.should.have.keys(['british-date', 'past', 'since', 'email-chars']);
    });
  });

});

describe('custom validators', () => {
  describe('british-date', () => {
    it('should exist as a function', () => {
      hof.validators.should.have.property('british-date').that.is.a('function');
    });

    it('should accept properly formatted dates', () => {
      hof.validators['british-date']('31/12/1999').should.be.true;
      hof.validators['british-date']('3/1/1999').should.be.true;
      hof.validators['british-date']('3/1/99').should.be.true;
    });

    it('should accept short format dates', () => {
      hof.validators['british-date']('31121999').should.be.true;
      hof.validators['british-date']('03011999').should.be.true;
    });

    it('should accept really short format dates', () => {
      hof.validators['british-date']('311299').should.be.true;
      hof.validators['british-date']('030199').should.be.true;
    });

    it('should not accept improperly formatted dates', () => {
      hof.validators['british-date']('11/22/1999').should.be.false;
      hof.validators['british-date']('3-1-99').should.be.false;
      hof.validators['british-date']('1/1/111').should.be.false;
      hof.validators['british-date']('1/1/1').should.be.false;
    });

    it('should not accept short format dates without leading zeros', () => {
      hof.validators['british-date']('3111999').should.be.false;
      hof.validators['british-date']('311999').should.be.false;
    });
  });

  describe('past', () => {
    it('should exist as a function', () => {
      hof.validators.should.have.property('past').that.is.a('function');
    });

    it('should accept dates in the past', () => {
      hof.validators.past('1/1/1970').should.be.true;
      hof.validators.past('01011970').should.be.true;
    });

    it('should accept today\'s date', () => {
      hof.validators.past(moment().format('DD/MM/YYYY')).should.be.true;
      hof.validators.past(moment().format('DDMMYYYY')).should.be.true;
    });

    it('should not accept dates in the future', () => {
      hof.validators.past(moment().add(1, 'day').format('DD/MM/YYYY')).should.be.false;
      hof.validators.past(moment().add(1, 'day').format('DDMMYYYY')).should.be.false;
    });
  });

  describe('since', () => {
    it('should exist as a function', () => {
      hof.validators.should.have.property('since').that.is.a('function');
    });

    it('should accept dates after a specified date', () => {
      hof.validators.since(moment().add(1, 'year').format('DD/MM/YYYY'), moment()).should.be.true;
      hof.validators.since(moment().add(1, 'year').format('DDMMYYYY'), moment()).should.be.true;
    });

    it('should accept the day of the specified date', () => {
      const date = moment().add(-1, 'year');
      hof.validators.since(date.format('DD/MM/YYYY'), date).should.be.true;
      hof.validators.since(date.format('DDMMYYYY'), date).should.be.true;
    });

    it('should not accept dates before the specified date', () => {
      hof.validators.since(moment().add(-1, 'day').format('DD/MM/YYYY'), moment()).should.be.false;
      hof.validators.since(moment().add(-1, 'day').format('DDMMYYYY'), moment()).should.be.false;
    });
  });

  describe('email-chars', () => {
    it('should exist as a function', () => {
      hof.validators.should.have.property('email-chars').that.is.a('function');
    });

    it('should accept an empty string', () => {
      hof.validators['email-chars']('').should.be.true;
    });

    it('should accept all the standard email characters', () => {
      hof.validators['email-chars']('my_E-mail+%20@here.com').should.be.true;
    });

    it('should accept parts of email addresses', () => {
      hof.validators['email-chars']('@bingo.cz').should.be.true;
    });

    it('should not accept characters not suitable for email addresses', () => {
      hof.validators['email-chars']('this won\'t work').should.be.false;
      hof.validators['email-chars']('no*work').should.be.false;
      hof.validators['email-chars']('also\tbad').should.be.false;
    });
  });
});
