'use strict';

var proxyquire = require('proxyquire');

describe('controllers/details', function () {
  var Model = sinon.stub();
  Model.prototype.get = sinon.stub();
  Model.prototype.toJSON = sinon.stub();
  var detailsController = proxyquire('../../../controllers/details', {
    '../models': Model
  });

  describe('when called', function () {

    var req;
    var res;

    beforeEach(function () {
      req = {session: {model: {}}};
      res = {render: sinon.spy()};
    });

    it('calls the Model with the session model attributes', function () {
      var records = [{foo: 'foo'}];
      Model.prototype.get.withArgs('records').returns(records);

      detailsController(req, res);

      Model.should.have.been.calledWithExactly(req.session.model);
    });

    describe('renders the details page', function () {

      it('with the record', function () {
        var records = [{foo: 'foo'}];
        var query = {bar: 'baz'}
        Model.prototype.get.withArgs('records').returns(records);
        Model.prototype.get.withArgs('query').returns(query);

        detailsController(req, res);

        res.render.should.have.been.calledWithExactly('pages/details', {
          record: records[0],
          querystring: 'bar=baz'
        });
      });

      it('with a record containing the system-number', function () {
        var records = [{'system-number': 0}, {'system-number': 12345}];
        var query = {bar: 'baz'}
        req.params = {sysnum: '12345'};
        Model.prototype.get.withArgs('records').returns(records);
        Model.prototype.toJSON.returns({records: records});
        Model.prototype.get.withArgs('query').returns(query);

        detailsController(req, res);

        res.render.should.have.been.calledWithExactly('pages/details', {
          record: records[1],
          querystring: 'bar=baz'
        });
      });

    });

  });

});
