'use strict';

const proxy = require('./');

proxy('localhost', 8081, 'localhost', 8080, 'lev-api-user');
