'use strict';

module.exports = (target) => {
  target.shouldBeOnLoginPage = function () {
    const body = this.getText('body');
    body.should.have.string('Username or email');
    body.should.have.string('Password');
  };

  target.submitLoginPage = function (username, password) {
    this.setValue('input[name="username"]', username);
    this.setValue('input[name="password"]', password);
    this.submitForm('form');
  };
};
