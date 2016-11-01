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

  it('should respond with 200 - OK to local requests', done => {
    req.ip = '127.0.0.1';
    fn(req, res, err => {
      done(err || new Error('next function should not be called!'));
    });
    res.on('end', () => {
      expect(res.send).to.have.been.calledWith('OK');
      done();
    });
  });

  it('should do nothing when the request is not from localhost', done => {
    req.ip = '1.1.1.1';
    fn(req, res, err => {
      expect(err).to.equal(undefined);
      expect(res.send).not.to.have.been.called;
      done();
    });
  });
});
