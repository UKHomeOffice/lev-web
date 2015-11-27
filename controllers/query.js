'use strict';

var Model = require('../models');

module.exports = {

  show: function showQueryPage(req, res) {
    res.render('pages/query');
  },

  get: function getQueryResults(req, res) {
    var model = new Model(req.body);

    return model.get().then(function resolved(result) {
      var records = result.records;

      if (records && records.length === 1) {
        res.locals.records = records[0];
        res.redirect('/details');
      } else if (records.length > 1) {
        res.locals.records = records;
        res.redirect('/list');
      }

    }).catch(function rejected(err) {
      throw new Error(err);
    });
  }
};
