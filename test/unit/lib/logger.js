'use strict';

const rewire = require('rewire');
const logger = rewire('../../../lib/logger');

const fn = logger.__get__('stringify'); // eslint-disable-line no-underscore-dangle

describe('logger', () => {
  describe('stringify function', () => {
    it('should return literals as a string', () => {
      expect(fn(4)).to.equal('4');
      expect(fn({})).to.equal('{}');
      expect(fn([])).to.equal('[]');
      expect(fn(null)).to.equal('null');
      expect(fn(true)).to.equal('true');
      expect(fn(false)).to.equal('false');
      expect(fn('a string')).to.equal('"a string"');
    });

    it('should wrap errors in a custom object then return it as a string', () => {
      expect(fn(new Error('oops'))).to.be.a('string');
      expect(JSON.parse(fn(new Error('oops'))))
        .to.be.an('object')
        .that.has.keys(
          'level',
          'timestamp',
          'message',
          'fileName',
          'lineNumber',
          'columnNumber',
          'stack'
        );
    });
  });
});
