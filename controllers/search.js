'use strict';

module.exports = {

  show: function show(req, res) {
    res.render('pages/search', {values: req.query, action: '/results'});
  }

};
