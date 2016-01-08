'use strict';

var proxyquire = require('proxyquire');
var api = {
  read: sinon.stub()
};

describe('models/index', function () {
  var Model = proxyquire('../../../models', {
    '../api': api
  });
  var model;
  var attributes = {foo: 'bar'};

  beforeEach(function () {
    model = new Model(attributes);
  });

  describe('with an argument', function () {
    it('assigns the argument to the attributes', function () {
      model.attributes.should.deep.equal(attributes);
    });
  });

  describe('.set(id, value)', function () {
    it('adds the value to the attributes by id', function () {
      model.attributes.foo.should.equal('bar');
    });
  });

  describe('.get(id)', function () {
    it('returns the value form the attributes by id', function () {
      model.get('foo').should.equal('bar');
    });
  });

  describe('.toJSON())', function () {
    it('returns all the attributes', function () {
      model.toJSON().should.deep.equal(attributes);
    });
  });

  describe('.read()', function () {

    beforeEach(function () {
      var promise = model.read();
    });

    it('calls the api', function () {
      api.read.should.have.been.calledWith(attributes);
    });

  });

});
