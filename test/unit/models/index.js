'use strict';

var proxyquire = require('proxyquire');

describe('models/index', function () {
  var stubs = [{
    foo: 'bar',
    bar: 'baz'
  }, {
    bar: 'foo',
    baz: 'baz'
  }];
  var Model = proxyquire('../../../models', {
    './stubs': stubs
  });
  var model;

  beforeEach(function () {
    model = new Model({foo: 'bar'});
  });

  describe('with an argument', function () {
    it('assigns the argument to the attributes', function () {
      model.attributes.should.deep.equal({foo: 'bar'});
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
      model.toJSON().should.deep.equal({foo: 'bar'});
    });
  });

  describe('.read()', function () {

    var promise;

    beforeEach(function () {
      promise = model.read();
    });

    it('resolves with records', function (done) {
      promise.then(function (result) {
        result.records.should.deep.equal([{
          foo: 'bar',
          bar: 'baz'
        }]);
        done();
      });
    });

  });

});
