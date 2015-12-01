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
    var records;

    beforeEach(function () {
      req = {session: {model: {}}};
      res = {render: sinon.spy()};
    });

    it('calls the Model with the session model attributes', function () {
      records = [{foo: 'foo'}];
      Model.prototype.get.withArgs('records').returns(records);
      detailsController(req, res);

      Model.should.have.been.calledWithExactly(req.session.model);
    });

    describe('renders the details page', function () {

      it('with the record', function () {
        records = [{foo: 'foo'}];
        Model.prototype.get.withArgs('records').returns(records);
        detailsController(req, res);

        res.render.should.have.been.calledWithExactly('pages/details', {
          record: records[0]
        });
      });

      it('with a record containing the system-number', function () {
        records = [{'system-number': '00000'}, {'system-number': '12345'}];
        req.params = {sysnum: '12345'};
        Model.prototype.get.withArgs('records').returns(records);
        Model.prototype.toJSON.returns({records: records});

        detailsController(req, res);

        res.render.should.have.been.calledWithExactly('pages/details', {
          record: records[1]
        });
      });

      it('with a message when no records exist', function () {
        records = [];
        req.params = {};
        Model.prototype.get.withArgs('records').returns(records);
        detailsController(req, res);

        res.render.should.have.been.calledWithExactly('pages/details', {
          message: 'No records available'
        });
      });

    });

  });

});
