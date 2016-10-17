'use strict';

const proxy = require('./');

proxy('localhost', 8002, 'localhost', 8001, 'lev-e2e-tests');

