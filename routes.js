'use strict';

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('pages/query');
  });

  app.get('/list', function (req, res) {
    res.render('pages/list');
  });

  app.get('/details', function (req, res) {
    res.render('pages/details');
  });

};
