'use strict';

var request = require('request');
var fs = require('fs');
var config = require('../config');
var _ = require('lodash');

var accessToken;

function urlToObject(requestArgs) {
  return _.isObject(requestArgs)
    ? requestArgs
    : {
      url: requestArgs
    };
}

function addTlsConfig(requestArgs) {
  if(config.lev_tls.key || config.lev_tls.cert || config.lev_tls.ca) {
    requestArgs = urlToObject(requestArgs);

    requestArgs.key = fs.readFileSync(config.lev_tls.key);
    requestArgs.cert = fs.readFileSync(config.lev_tls.cert);
    requestArgs.ca = fs.readFileSync(config.lev_tls.ca);
  }

  return requestArgs;
}

function get(requestGetArgs, oauthUrl, clientId, clientSecret, username, password, callback) {
  function doRequestWithAccessToken(requestGetArgs, accessToken, callback) {
    var authHeader = 'Bearer ' + accessToken;

    requestGetArgs = urlToObject(requestGetArgs);

    requestGetArgs.headers = requestGetArgs.headers || {};
    requestGetArgs.headers.Authorization = authHeader;

    requestGetArgs = addTlsConfig(requestGetArgs);

    request.get(requestGetArgs, callback);
  }

  function useOAuth(err, res, body) {
    try {
      accessToken = JSON.parse(body).access_token;
      if (_.isUndefined(accessToken)) {
        callback(err, res, body);
      } else {
        doRequestWithAccessToken(requestGetArgs, accessToken, callback);
      }
    } catch (err) {
      callback(err, res, body);
    }
  }

  function requestURLWithAccessToken(requestGetArgs, accessToken, oauthUrl, clientId, clientSecret, username, password, callback) {
    // Try request with current access token
    doRequestWithAccessToken(requestGetArgs, accessToken, function checkResponse(err, res, body) {
      // If unauthorised then do auth and use new access token for next requestl
      if (res.statusCode != 200) {
        doOAuth(oauthUrl, clientId, clientSecret, username, password, useOAuth);
      } else {
        callback(err, res, body);
      }
    })
  }

  if (_.isUndefined(oauthUrl) || _.isUndefined(clientId) || _.isUndefined(clientSecret) ||
    _.isUndefined(username) || _.isUndefined(password)) {
    // If oauth stuff isn't all provided just do a get against the usual url
    requestGetArgs = addTlsConfig(requestGetArgs);

    request.get(requestGetArgs, callback);
  } else {
    if (_.isUndefined(accessToken)) {
      // It no access token then authorize and use new access token
      doOAuth(oauthUrl, clientId, clientSecret, username, password, useOAuth);
    } else {
      // If existing access token then try to use it for request
      requestURLWithAccessToken(requestGetArgs, accessToken, oauthUrl, clientId, clientSecret, username, password, callback);
    }
  }
}

function doOAuth(oauthUrl, clientId, clientSecret, username, password, callback) {
  var base64Auth = new Buffer(clientId + ':' + clientSecret).toString('base64');
  var authHeader = 'Basic ' + base64Auth;
  var requestPostArgs = {
    url: oauthUrl,
    form: {
      grant_type: 'password',
      username: username,
      password: password
    },
    headers: {
      Authorization: authHeader
    }
  };

  requestPostArgs = addTlsConfig(requestPostArgs);

  request.post(requestPostArgs, callback);
}

module.exports = {
  get: get
};
