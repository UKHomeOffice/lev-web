'use strict';

var proxyquire = require('proxyquire');

describe('controllers/results', function () {
  var Model = sinon.stub();
  Model.prototype.get = sinon.stub();
  Model.prototype.toJSON = sinon.stub();
  var resultsController = proxyquire('../../../controllers/results', {
    '../models': Model
  });

  describe('when called', function () {

    var req = {};
    var res = {
      render: sinon.spy()
    };
    var records;
    var query;

    beforeEach(function () {
      req = {session: {model: {}}};
      res = {render: sinon.spy()};
      records = [{foo: 'foo'}, {bar: 'baz'}];
      Model.prototype.get.withArgs('records').returns(records);
      query = {name: 'foo'};
      Model.prototype.get.withArgs('query').returns(query);
      resultsController(req, res);
    });

    it('renders the results page', function () {

      res.render.should.have.been.calledWithExactly('pages/results', {
        count: 2,
        records: records,
        query: query
      });
    });

  });

});
