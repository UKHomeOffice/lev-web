'use strict';

var proxyquire = require('proxyquire');

describe('lib/lev-request', function() {
  describe('get', function() {
    var requestGet;
    var levRequest;
    var fsReadFileSync;
    var config;

    beforeEach(sinon.test(function() {
      config = {};

      requestGet = this.stub();

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
    }));

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
            ca: 'TLS CA'
        });
    });

    it('Adds a bearer token when provided', () => {
      levRequest.get('http://testhost.com', 'access_token');

      requestGet.should.have.been.calledWith({
        url: 'http://testhost.com',
        headers: {
          Authorization: 'Bearer access_token'
        }
      });
    });
  });
});
