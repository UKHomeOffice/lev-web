'use strict';

const rewire = require('rewire');
const reqres = require('reqres');

const health = rewire('../../../lib/health');
const fn = health.__get__('respond'); // eslint-disable-line no-underscore-dangle

describe('Health check endpoints', () => {
  var req;
  var res;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
  });

  it('should respond with 200 - OK to all requests', done => {
    fn(req, res, err => {
      done(err || new Error('next function should not be called!'));
    });
    res.on('end', () => {
      expect(res.send).to.have.been.calledWith('OK');
      done();
    });
  });
});
