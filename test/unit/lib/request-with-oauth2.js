'use strict';

var proxyquire = require('proxyquire');

describe('lib/requestWithOAuth2', function() {
  describe('a get request', function() {
    var request = require('request');
    var requestGet;
    var requestPost;
    var requestWithOAuth2;
    var accessToken1 = 'my_access_token';

    var successfulAuthResponse = {
      'access_token': accessToken1,
      'expires_in': 300,
      'refresh_expires_in': 1800,
      'refresh_token': 'xxxx',
      'token_type': 'bearer',
      'id_token': 'yyyy',
      'not-before-policy': 0,
      'session_state': 'zzzz'
    };

    const expectedBase64Auth = new Buffer('clientId:clientSecret').toString('base64');
    const expectedAuthHeader = 'Basic ' + expectedBase64Auth;
    const expectedUserOAuthRequest = {
      url: 'http://oauthserver.com',
      form: {
        grant_type: 'password', // eslint-disable-line camelcase
        username: 'username',
        password: 'password'
      }
    };
    const expectedClientOAuthRequest = {
      url: 'http://oauthserver.com',
      headers: {
        Authorization: expectedAuthHeader
      }
    };
    const expectedFullOAuthRequest = Object.assign({}, expectedClientOAuthRequest, expectedUserOAuthRequest);

    var expectedTesthostRequest = {
      url: 'http://testhost.com',
      headers: {
        Authorization: 'Bearer ' + accessToken1
      }
    };

    beforeEach(sinon.test(function() {
      requestGet = this.stub();
      request.get = requestGet;
      requestPost = this.stub();
      request.post = requestPost;

      requestWithOAuth2 = proxyquire('../../../lib/request-with-oauth2', {
        request: request
      });
    }));

    it('GETs the configured url when no OAuth2 credentials are provided', function(done) {
      requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

      requestWithOAuth2.get('http://testhost.com', undefined, undefined, undefined, undefined, undefined,
        function() {
          request.get.should.have.been.calledWith('http://testhost.com');
          done();
        });
    });

    describe('GETs an authorization token from the oAuth2 server', () => {
      it('and uses returned auth token in GET request to URL',
        function(done) {
          requestPost.onFirstCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
          requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

          requestWithOAuth2.get('http://testhost.com', 'http://oauthserver.com', 'clientId', 'clientSecret',
            'username', 'password', function() {
              request.post.should.have.been.calledWith(expectedFullOAuthRequest);
              request.get.should.have.been.calledWith(expectedTesthostRequest);
              done();
            });
        });

      it('when only user and password are known, and uses returned auth token in GET request to URL',
        function(done) {
          requestPost.onFirstCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
          requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

          requestWithOAuth2.get('http://testhost.com', 'http://oauthserver.com', undefined, undefined,
            'username', 'password', function() {
              request.post.should.have.been.calledWith(expectedUserOAuthRequest);
              request.get.should.have.been.calledWith(expectedTesthostRequest);
              done();
            });
        });

      it('when only client and secret are known, and uses returned auth token in GET request to URL',
        function(done) {
          requestPost.onFirstCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
          requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

          requestWithOAuth2.get('http://testhost.com', 'http://oauthserver.com', 'clientId', 'clientSecret',
            undefined, undefined, function() {
            request.post.should.have.been.calledWith(expectedClientOAuthRequest);
            request.get.should.have.been.calledWith(expectedTesthostRequest);
            done();
          });
        });
    });

    it('Uses an existing authorization token if present', function(done) {
      // First call to oAuth server
      requestPost.yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
      // First call to URL
      requestGet.yields(null, { statusCode: 200 }, 'Woo');
      requestWithOAuth2.get(
        'http://testhost.com',
        'http://oauthserver.com',
        'clientId',
        'clientSecret',
        'username',
        'password',
        function() {
          request.post.should.have.been.calledWith(expectedFullOAuthRequest);
          request.get.should.have.been.calledWith(expectedTesthostRequest);
          requestWithOAuth2.get(
            'http://testhost.com',
            'http://oauthserver.com',
            'clientId',
            'clientSecret',
            'username',
            'password',
            function() {
              // Check it doesn't authorize with multiple requests
              assert(request.post.calledOnce);
              done();
            });
        });
    });

    it('Will return the error from the oAuth request if there is one', function(done) {
      // First call to oAuth server
      requestPost.yields(null, { statusCode: 400 }, {});
      // First call to URL
      requestWithOAuth2.get(
        'http://testhost.com',
        'http://oauthserver.com',
        'clientId',
        'clientSecret',
        'username',
        'password',
        function(e, res) {
          request.post.should.have.been.calledWith(expectedFullOAuthRequest);
          sinon.assert.notCalled(request.get);
          assert(res.statusCode === 400, 'Status code not 400 as expected');
          done();
        });
    });

    it('Will re-authenticate with the oAuth server if a response comes back with unauthorized', function(done) {
      var expectedTesthostRequestWithNewToken = {
        url: 'http://testhost.com',
        headers: {
          Authorization: 'Bearer ' + accessToken1
        }
      };
      var accessToken2 = 'new_access_token';
      var successfulAuthResponse2 = {
        'access_token': accessToken2,
        'expires_in': 300,
        'refresh_expires_in': 1800,
        'refresh_token': 'xxxx',
        'token_type': 'bearer',
        'id_token': 'yyyy',
        'not-before-policy': 0,
        'session_state': 'zzzz'
      };

      // First call to oAuth server
      requestPost.onFirstCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
      // First call to URL with auth returns unauthorized as if token has expired
      requestGet.onFirstCall().yields(null, { statusCode: 401 }, {});
      // Second call to oAuth server to re-authenticate
      requestPost.onSecondCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse2));

      requestWithOAuth2.get(
        'http://testhost.com',
        'http://oauthserver.com',
        'clientId',
        'clientSecret',
        'username',
        'password',
        function() {
          request.post.should.have.been.calledWith(expectedFullOAuthRequest);
          request.get.should.have.been.calledWith(expectedTesthostRequest);
          request.post.should.have.been.calledWith(expectedFullOAuthRequest);
          request.get.should.have.been.calledWith(expectedTesthostRequestWithNewToken);
          done();
        });
    });

    it('Will return the response from the OAuth server if there are errors', function(done) {
      // First call to oAuth server
      requestPost.onFirstCall().yields(null, { statusCode: 500 }, {});

      requestWithOAuth2.get(
        'http://testhost.com',
        'http://oauthserver.com',
        'clientId',
        'clientSecret',
        'username',
        'password',
        function(e, res) {
          request.post.should.have.been.calledWith(expectedFullOAuthRequest);
          // Check it doesn't try to call the get on the usual URL
          sinon.assert.notCalled(request.get);
          // request.get.should.have.been.notCalled();
          // Change this condition to be that the response returned should have a 500 status code
          assert(res.statusCode === 500, 'Returned status code was not the 500 from the oAuth server as expected');
          done();
        });
    });

    it('GETs the configured url with the given headers when provided', function(done) {
      requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

      requestWithOAuth2.get({
        'url': 'http://testhost.com',
        'headers': {
          'my-custom-header': 'i.love.headers'
        }
      }, undefined, undefined, undefined, undefined, undefined, function() {
        request.get.should.have.been.calledWith({
          'url': 'http://testhost.com',
          'headers': {
            'my-custom-header': 'i.love.headers'
          }
        });
        done();
      });
    });

    it('GETs the configured url with the given headers and the authorization header as well', function(done) {
      requestPost.onFirstCall().yields(null, { statusCode: 200 }, JSON.stringify(successfulAuthResponse));
      requestGet.onFirstCall().yields(null, { statusCode: 200 }, {});

      requestWithOAuth2.get({
        'url': 'http://testhost.com',
        'headers': {
          'my-custom-header': 'i.love.headers'
        }
      }, 'http://oauthserver.com', 'clientId', 'clientSecret', 'username', 'password', function() {
        request.post.should.have.been.calledWith(expectedFullOAuthRequest);
        request.get.should.have.been.calledWith({
          url: 'http://testhost.com',
          headers: {
            Authorization: 'Bearer ' + accessToken1,
            'my-custom-header': 'i.love.headers'
          }
        });
        done();
      });
    });
  });
});
