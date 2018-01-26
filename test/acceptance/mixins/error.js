'use strict';

const url = require('../config').url;

module.exports = (target) => {

  target.shouldBeOnErrorPage = () => target.getText('h1').should.equal('Error');

  target.shouldBeOn404Page = () => {
    target.shouldBeOnErrorPage();
    target.getText('main').should.contain('Not found');
  };

  target.doBadBirthSearch = () => target.url(url + '/details/404');

  target.doBadAuditSearch = () => target.url(url + '/audit/user-activity?from=200118&to=100118');
};
