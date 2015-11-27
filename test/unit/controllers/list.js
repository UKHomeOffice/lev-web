'use strict';

describe('controllers/list', function () {
  var listController = require('../../../controllers/list');
  var req = {};
  var res = {
    render: sinon.spy()
  };

  beforeEach(function () {
    listController(req, res);
  });

  it('renders the list page', function () {
    res.render.should.have.been.calledWith('pages/list');
  });

});
