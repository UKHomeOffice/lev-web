'use strict';

module.exports = (req) => (req && req.headers && (headers => ({
  token: headers['x-auth-token'],
  username: headers['x-auth-username'],
  client: headers['x-auth-aud'],
  groups: headers['x-auth-groups'] && String(headers['x-auth-groups']).split(',') || [],
  roles: headers['x-auth-roles'] && String(headers['x-auth-roles']).split(',') || []
}))(Object.keys(req.headers).reduce((o, h) => Object.assign(o, { [h.toLowerCase()]: req.headers[h] }), {})) || {});
