'use strict';

module.exports = (target) => {
  target.shouldBeOnLoginPage = function() {
    browser.element('input[name="login"]').should.exist;
  };

  target.submitLoginPage = function(username, password) {
    this.click('summary');
    this.setValue('input[name="username"]', username);
    this.setValue('input[name="password"]', password);
    this.submitForm('form');
  };
};
