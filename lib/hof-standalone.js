'use strict';

var Parent = require('hof').controllers.base;
var ErrorClass = require('hof').controllers.error;
var util = require('util');
var _ = require('underscore');

var StandaloneController = function StandaloneController() {
  Parent.apply(this, arguments);
};

util.inherits(StandaloneController, Parent);

StandaloneController.prototype.get = function get(req, res, callback) {
  // Use query params in place of request body when it isn't provided
  req.body = req.body || req.query;

  // Treat requests with query params as form submissions
  return Object.keys(req.query).length
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
    return callback(err);
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
  (req.query.edit === undefined) ? Parent.prototype.validate.apply(this, arguments): callback(new ErrorClass(null, {type: 'EDIT'}, req));
};

module.exports = StandaloneController;
