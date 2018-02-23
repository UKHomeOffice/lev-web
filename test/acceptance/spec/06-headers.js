'use strict';

const request = require('request');
const url = require('../config').url;

describe('Header check', () => {
  let response;

  const makeRequest = (path, done) => {
    request.get(url + path, (err, res) => {
      response = res;
      done(err);
    });
  };

  describe('the main search endpoint "/"', () => {
    before(done => {
      makeRequest('/', done);
    });

    it('should have the cache-control and x-frame-options headers', () =>
      expect(response).to.include({ statusCode: 200 })
        .and.have.property('headers').that.includes({
        'cache-control': 'no-cache; no-store',
        'x-frame-options': 'DENY'
      }));
  });

  describe('the static resource endpoint for CSS styles "/public/css/app.css"', () => {
    before(done => {
      makeRequest('/public/css/app.css', done);
    });

    it('should not have the x-frame-options header, or have cache-control set to DENY', () => {
      expect(response).to.include({ statusCode: 200 }).and.have.property('headers');
      expect(response.headers).not.to.have.property('x-frame-options');
      expect(response.headers).not.to.have.property('cache-control', 'no-cache; no-store');
    });
  });
});
