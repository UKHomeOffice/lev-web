'use strict';

var proxyquire = require('proxyquire');

describe('lib/lev-request', function() {
  describe('get', function() {
    var requestGet;
    var levRequest;
    var fsReadFileSync;
    var config;

    beforeEach(() => {
      config = {
        api: {
          username: 'user',
          clientName: 'client'
        }
      };

      requestGet = sinon.stub();

      fsReadFileSync = sinon.stub();

      levRequest = proxyquire('../../../lib/lev-request', {
        fs: {
          readFileSync: fsReadFileSync
        },
        'request': {
          get: requestGet
        },
        '../config': config
      });
    });

    it('Adds config for mutual TLS when available', () => {
      config.lev_tls = { // eslint-disable-line camelcase
        key: 'TLS Key',
        cert: 'TLS Cert',
        ca: 'TLS CA'
      };

      fsReadFileSync.returnsArg(0);

      levRequest.get('http://testhost.com');

      requestGet.should.have.been.calledWith({
        url: 'http://testhost.com',
        key: 'TLS Key',
        cert: 'TLS Cert',
        ca: 'TLS CA',
        agentOptions: {
          rejectUnauthorized: true
        },
        headers: {
          'X-Auth-Aud': 'client',
          'X-Auth-Username': 'user'
        }
      });
    });

    it('Does not verify the TLS certificate when configured to do so', () => {
      config.lev_tls = { // eslint-disable-line camelcase
        verify: false
      };

      levRequest.get('http://testhost.com');

      requestGet.should.have.been.calledWith({
        url: 'http://testhost.com',
        agentOptions: {
          rejectUnauthorized: false
        },
        headers: {
          'X-Auth-Aud': 'client',
          'X-Auth-Username': 'user'
        }
      });
    });

    it('Adds a bearer token when provided', () => {
      levRequest.get('http://testhost.com', { token: 'access_token' });

      requestGet.should.have.been.calledWith({
        url: 'http://testhost.com',
        headers: {
          Authorization: 'Bearer access_token',
          'X-Auth-Username': 'user',
          'X-Auth-Aud': 'client'
        },
        agentOptions: {
          rejectUnauthorized: true
        }
      });
    });
  });
});
