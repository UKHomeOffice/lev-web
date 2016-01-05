'use strict';

var _ = require('underscore');

module.exports = {

  show: function show(req, res) {
    res.render('pages/login');
  },

  create: function create(req, res) {
    req.session.logginIn = true;
    res.redirect('/search');
  }
};
