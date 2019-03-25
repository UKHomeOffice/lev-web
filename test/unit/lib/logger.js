'use strict';

const rewire = require('rewire');
const proxyquire = require('proxyquire');
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

  describe('with production mode enabled', function() {
    before(() => {
      this.logger = proxyquire('../../../lib/logger', {
        '../config': { env: 'production' }
      });
    });

    it('should have exception handlers', () =>
      expect(this.logger).to.be.an('object').that.has.property('exceptionHandlers').which.is.not.empty);
  });

  describe('with production mode disabled', function() {
    before(() => {
      this.logger = proxyquire('../../../lib/logger', {
        '../config': { env: 'development' }
      });
    });

    it('should not have exception handlers', () =>
      expect(this.logger).to.be.an('object').that.has.property('exceptionHandlers').which.is.empty);
  });
});
