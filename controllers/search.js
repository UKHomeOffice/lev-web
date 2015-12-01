'use strict';

var Model = require('../models');

module.exports = {

  show: function show(req, res) {
    res.render('pages/search');
  },

  query: function query(req, res) {
    var model = new Model(req.body);

    return model.read().then(function resolved(result) {
      var records = result.records;
      model.set('records', records);
      model.set('query', req.body);

      req.session.model = model;

      if (records.length === 1) {
        res.redirect('/details');
      }
      if (records.length > 1) {
        res.redirect('/results');
      }

    }).catch(function rejected(err) {
      throw new Error(err);
    });
  }
};
