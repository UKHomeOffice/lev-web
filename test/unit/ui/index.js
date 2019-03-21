'use strict';

const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom-global');
const fixture = fs.readFileSync(path.resolve(__dirname, 'fixture.html'));
const output = fs.readFileSync(path.resolve(__dirname, 'fixture.csv')).toString();
const proxyquire = require('proxyquire');


describe('auidt report UI', () => {
  const search = '?from=190117&to=290117&user=';
  const url = `http://lev.com/${search}`;
  let saver;

  let cleanup = jsdom(fixture, {
    url: url,
    contentType: 'text/html'
  });
  const genIndex = () => proxyquire('../../../assets/js/index.js', {
    './details.polyfill': sinon.spy(),
    'file-saver': {
      saveAs: (saver = sinon.spy())
    }
  });
  let index = genIndex(saver);

  after('cleanup', () => {
    cleanup();
  });

  it('has location object and search property', () => {
    expect(global.location).has.property('search', search);
  });

  describe('#getAuditData', () => {
    it('should be a function', () => {
      expect(index.getAuditData).to.be.a('function');
    });

    it('should produce CSV data', () => {
      expect(index.getAuditData()).to.equal(output);
    });
  });

  describe('#getAuditData', () => {
    it('should be a function', () => {
      expect(index.saveData).to.be.a('function');
    });

    describe('activating the function', () => {
      beforeEach(() => {
        index = genIndex();
      });

      it('should produce CSV data after a click', () => {
        const event = {
          preventDefault: sinon.spy(),
          type: 'click'
        };
        index.saveData(event);

        expect(event.preventDefault).to.have.been.calledOnce;
        expect(saver).to.have.been.calledOnce
          .and.to.have.been.calledWith(
          sinon.match.any,
            // new global.Blob(['something else'], { type: 'text/plain;charset=UTF-8' }),
            'audit_report_19-01-17_to_29-01-17.csv'
          );
      });

      it('should produce CSV data after the Enter key is pressed', () => {
        const event = {
          preventDefault: sinon.spy(),
          type: 'keydown',
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        };
        index.saveData(event);

        expect(event.preventDefault).to.have.been.calledOnce;
        expect(saver).to.have.been.calledOnce
          .and.to.have.been.calledWith(
            sinon.match.any,
            // new global.Blob(['something else'], { type: 'text/plain;charset=UTF-8' }),
            'audit_report_19-01-17_to_29-01-17.csv'
          );
      });

      it('should not produce CSV data when "space" key pressed', () => {
        const event = {
          preventDefault: sinon.spy(),
          type: 'keydown',
          key: ' ',
          Code: 'Space',
          keyCode: 32
        };
        index.saveData(event);

        expect(event.preventDefault).not.to.have.been.called;
        expect(saver).not.to.have.been.called;
      });
    });
  });

});
