'use strict';

const request = require('request');
const url = require('../config').url;

describe('Health check', () => {
  let result;

  const makeRequest = (path, done) => {
    request.get(url + path, (err, response) => {
      result = response;
      done(err);
    });
  };

  describe('the "/healthz" endpoint', () => {
    before(done => {
      makeRequest('/healthz', done);
    });

    it('should return a "200 - OK" status', () => {
      expect(result.statusCode).to.equal(200);
    });
  });

  describe('the "/readiness" endpoint', () => {
    before(done => {
      makeRequest('/readiness', done);
    });

    it('should return a "200 - OK" status', () => {
      expect(result.statusCode).to.equal(200);
    });
  });
});
