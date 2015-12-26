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

    var req = req = {session: {model: {}}};
    var res = {render: sinon.spy()};
    var records = [{foo: 'foo'}, {bar: 'baz'}];
    var query = {name: 'foo'};

    beforeEach(function () {
      Model.prototype.get.withArgs('records').returns(records);
      Model.prototype.get.withArgs('query').returns(query);
      resultsController(req, res);
    });

    it('renders the results page', function () {
      res.render.should.have.been.calledWithExactly('pages/results', {
        count: 2,
        records: records,
        query: query,
        querystring: 'name=foo'
      });
    });

  });

});
