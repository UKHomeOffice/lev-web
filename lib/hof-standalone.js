'use strict';

var hof = require('hof');
var Parent = hof.controllers.base;
var ErrorClass = hof.controllers.error;
// Welcome to Hack City. We hope you enjoy your stay!
var validators = require(
  '../node_modules/hof/node_modules/hof-controllers/node_modules/hmpo-form-wizard'
).Controller.validators;
// You are now leaving Hack City.
var util = require('util');
var _ = require('lodash');

var StandaloneController = function StandaloneController() {
  Parent.apply(this, arguments);
};

util.inherits(StandaloneController, Parent);

StandaloneController.prototype.get = function get(req, res, callback) {
  var submitted = _.intersection(
    Object.keys(req.query),
    Object.keys(this.options.fields)
  );

  // Use query params in place of request body
  req.body = req.query;

  // Treat requests with expected query params as form submissions
  return Object.keys(submitted).length
    ? this.post(req, res, callback)
    : Parent.prototype.get.apply(this, arguments);
};

// Just like the original but instead of redirecting we render
// immediately
StandaloneController.prototype.errorHandler = function errorHandler(err, req, res, callback) {
  if (err.type === 'EDIT') {
    this.setErrors(null, req, res);
    Parent.prototype.get.call(this, req, res, callback);
  } else if (this.isValidationError(err)) {
    this.setErrors(err, req, res);
    Parent.prototype.get.call(this, req, res, callback);
  } else {
    // if the error is not a validation error then throw and let the error handler pick it up
    callback(err);
  }
};

// The errors are already on the request object
StandaloneController.prototype.getErrors = function getErrors(req) {
  return req.form.errors || {};
};

// Just store in memory on the request object
StandaloneController.prototype.setErrors = function setErrors(err, req) {
  var errorValues = req.form ? req.form.values : undefined;

  req.form = _.extend({}, req.form, {
    errors: err,
    errorValues: errorValues
  });
};

// The values are already on the request object
StandaloneController.prototype.getValues = function getValues(req, res, callback) {
  callback(null, _.extend({}, req.form.values, req.form.errorValues));
};

// Just store in memory on the request object
StandaloneController.prototype.saveValues = function saveValues(req, res, callback) {
  delete req.form.errorValues;
  callback();
};

// Check if we are editing a previous submission
StandaloneController.prototype.validate = function validate(req, res, callback) {
  if (req.query.edit === undefined) {
    Parent.prototype.validate.apply(this, arguments);
  } else {
    callback(new ErrorClass(null, { type: 'EDIT' }, req));
  }
};

StandaloneController.validators = validators;

module.exports = StandaloneController;
