'use strict';

module.exports = function renderLoggedOut(req, res) {
  // FIXME: Delete once no longer needed!
  res.clearCookie('kc-access', {path: '/'});

  // Render page
  res.render('pages/logged-out');
};
