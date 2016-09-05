'use strict';

global.chai = require('chai').use(require('chai-as-promised')).use(require('sinon-chai'));
global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();
global.sinon = require('sinon');
