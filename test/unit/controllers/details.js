'use strict';

describe('controllers/details', function () {
  var detailsController = require('../../../controllers/details');
  var req = {};
  var res = {
    render: sinon.spy()
  };

  beforeEach(function () {
    detailsController(req, res);
  });

  it('renders the details page', function () {
    res.render.should.have.been.calledWith('pages/details');
  });

});
