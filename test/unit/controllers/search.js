'use strict';

describe('controllers/search', function () {
  var searchController = require('../../../controllers/search');

  describe('.show()', sinon.test(function () {

    var req = {};
    var res = {
      render: this.spy()
    };

    beforeEach(function () {
      searchController.show(req, res);
    });

    it('renders the search page', function () {
      res.render.should.have.been.calledWith('pages/search');
    });

  }));

});
