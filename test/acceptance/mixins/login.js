'use strict';

const loginButtonSelector = 'input[name="login"]';

module.exports = (target) => {
  target.shouldBeOnLoginPage = function() {
    browser.element(loginButtonSelector).should.exist;
  };

  target.completeLoginPage = function(username, password) {
    this.setValue('input[name="username"]', username);
    this.setValue('input[name="password"]', password);
    this.click(loginButtonSelector);
  };
};
