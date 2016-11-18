'use strict';

const request = require('request');
const requestHelper = require('./request-helper');
const logger = require('./logger');
const _ = require('lodash');

var accessToken;

function doRequestWithAccessToken(requestGetArgs, token, callback) {
  var authHeader = 'Bearer ' + token;

  requestGetArgs = requestHelper.urlToObject(requestGetArgs);

  requestGetArgs.headers = requestGetArgs.headers || {};
  requestGetArgs.headers.Authorization = authHeader;

  request.get(requestGetArgs, callback);
}

function doOAuth(oauthUrl, clientId, clientSecret, username, password, callback) {
  const details = {
    url: oauthUrl
  };
  if (username && password) {
    details.form = {
      username: username,
      password: password
    };
  }
  if (clientId && clientSecret) {
    const base64Auth = new Buffer(clientId + ':' + clientSecret).toString('base64');
    const authHeader = 'Basic ' + base64Auth;
    details.headers = {
      Authorization: authHeader
    };
  }

  request.post(details, callback);
}

function get(requestGetArgs, oauthUrl, clientId, clientSecret, username, password, callback) {
  function useOAuth(err, res, body) {
    if (err) {
      logger.log('error', 'Problem making oauth request');
      logger.log('error', err);
      callback(err, res, body);
    } else {
      try {
        accessToken = JSON.parse(body).access_token;
        if (_.isUndefined(accessToken)) {
          callback(err, res, body);
        } else {
          doRequestWithAccessToken(requestGetArgs, accessToken, callback);
        }
      } catch (err2) {
        callback(err2, res, body);
      }
    }
  }

  if (_.isUndefined(oauthUrl) || (
    (_.isUndefined(clientId) || _.isUndefined(clientSecret)) &&
    (_.isUndefined(username) || _.isUndefined(password)))) {
    // If oauth stuff isn't all provided just do a get against the usual url
    request.get(requestGetArgs, callback);
  } else if (_.isUndefined(accessToken)) {
    // If no access token then authorize and use new access token
    doOAuth(oauthUrl, clientId, clientSecret, username, password, useOAuth);
  } else {
    // If existing access token then try to use it for request
    doRequestWithAccessToken(requestGetArgs, accessToken, function checkResponse(err, res, body) {
      // If unauthorised then do auth and use new access token for next request
      if (!err && res.statusCode !== 200) {
        doOAuth(oauthUrl, clientId, clientSecret, username, password, useOAuth);
      } else {
        callback(err, res, body);
      }
    });
  }
}

module.exports = {
  get: get
};
