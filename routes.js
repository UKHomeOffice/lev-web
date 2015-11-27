'use strict';

module.exports = function defineRoutes(app) {

  app.get('/', function renderQuery(req, res) {
    res.render('pages/query');
  });

  app.get('/list', function renderList(req, res) {
    res.render('pages/list');
  });

  app.get('/details', function renderDetails(req, res) {
    res.render('pages/details');
  });

};
