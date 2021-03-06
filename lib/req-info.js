'use strict';

module.exports = (req) => (req && req.headers && {
  token: req.headers['x-auth-token'],
  username: req.headers['x-auth-username'],
  client: req.headers['x-auth-aud'],
  groups: req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [],
  roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
}) || {};
