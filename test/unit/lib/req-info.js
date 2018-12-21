'use strict';

const reqInfo = require('../../../lib/req-info');

describe('lib/req-info.js', () => {
  it('is a function', () => reqInfo.should.be.a('function'));
  it('takes one argument', () => reqInfo.length.should.equal(1));

  describe('when called with one argument', () => {
    describe('that is a request object', () => {
      describe('without any headers', () => {
        it('should return an empty object', () => reqInfo().should.be.an('object').that.is.empty);
        it('should return an empty object', () => reqInfo({}).should.be.an('object').that.is.empty);
      });

      describe('without keycloak-gatekeeper headers', () => {
        let result;

        before(() => {
          result = reqInfo({
            headers: {}
          });
        });

        it('returns a more friendly object', () => result.should.deep.equal({
          client: undefined,
          groups: [],
          roles: [],
          token: undefined,
          username: undefined
        }));
      });

      describe('with keycloak-gatekeeper headers', () => {
        let result;

        before(() => {
          result = reqInfo({
            headers: {
              'x-auth-token': 'token',
              'x-auth-aud': 'client',
              'x-auth-groups': 'group1,group2,group3',
              'x-auth-roles': 'role1,role2,role3',
              'x-auth-username': 'username'
            }
          });
        });

        it('returns a more friendly object', () => result.should.deep.equal({
          client: 'client',
          groups: [
            'group1',
            'group2',
            'group3'
          ],
          roles: [
            'role1',
            'role2',
            'role3'
          ],
          token: 'token',
          username: 'username'
        }));
      });

      describe('with keycloak-gatekeeper headers with mixed case names', () => {
        let result;

        before(() => {
          result = reqInfo({
            headers: {
              'X-Auth-Token': 'token',
              'X-Auth-Aud': 'client',
              'X-Auth-Groups': 'group1,group2,group3',
              'X-Auth-Roles': 'role1,role2,role3',
              'X-Auth-Username': 'username'
            }
          });
        });

        it('returns a more friendly object', () => result.should.deep.equal({
          client: 'client',
          groups: [
            'group1',
            'group2',
            'group3'
          ],
          roles: [
            'role1',
            'role2',
            'role3'
          ],
          token: 'token',
          username: 'username'
        }));
      });
    });
  });
});
