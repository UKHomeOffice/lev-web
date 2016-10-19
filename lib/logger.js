'use strict';

var winston = require('winston');
var config = require('../config');
var loggingTransports = [];
var exceptionTransports = [];
var notProd = (config.env === 'development' || config.env === 'acceptance');
var levels = {
  info: 0,
  warn: 1,
  error: 2
};
var colors = {
  info: 'green',
  warn: 'yellow',
  error: 'red'
};

const stringify = obj => JSON.stringify(
  obj instanceof Error ? {
    level: obj.level || 'unspecified',
    timestamp: obj.timestamp || 'unspecified',
    message: obj.toString(),
    fileName: obj.fileName || 'unspecified',
    lineNumber: obj.lineNumber || 'unspecified',
    columnNumber: obj.columnNumber || 'unspecified',
    stack: obj.stack
  } : obj
);

loggingTransports.push(
  new (winston.transports.Console)({
    json: notProd !== true,
    timestamp: true,
    colorize: true,
    stringify: stringify
  })
);

exceptionTransports.push(
  new (winston.transports.Console)({
    json: notProd !== true,
    timestamp: true,
    colorize: true,
    stringify: JSON.stringify
  })
);

var transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (notProd) {
  delete transports.exceptionHandlers;
}

var logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
