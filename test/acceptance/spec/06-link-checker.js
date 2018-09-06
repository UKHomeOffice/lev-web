'use strict';

const blc = require('broken-link-checker');
const { url } = require('../config');

const report = bl => `Broken links found:\n${Object.keys(bl).map(t => `\t- target: ${t}, ${bl[t]}`).join('\n')}\n`;
const link   = context => l => {
  if (l.broken && !context.broken[l.url.resolved]) {
    context.broken[l.url.resolved] = `found on page: ${l.base.resolved}, with selector: "${l.html.selector}"`;
  }
};
const checker = (followLinks, context, done) =>
  new blc[followLinks ? 'SiteChecker' : 'HtmlChecker']({
    filterLevel: 3,
    excludedKeywords: ['*/oauth/logout']
  }, followLinks ? {
    link: link(context),
    site: (e, url) => e && done(new Error(`${e.message} - code: ${e.code || e.status || e.statusCode} ${url}`)),
    end: done
  } : {
    link: link(context),
    complete: done
  });

describe('Check for broken links', () => {

  describe('on regular pages', () => {
    [ // eslint-disable-line array-bracket-spacing
      '/',                                              // the search page
      '/?system-123',                                   // the search page (with help image displayed)
      '/?surname=multiple&forenames=tester&dob=010110', // the results page
      '/details/123456789',                             // the details page
      '/audit/user-activity/?from=010118&to=210118'     // the audit page
    ].forEach(page => describe(page, function() {
      before('run check', function(done) {
        this.broken = {};
        checker(true, this, done).enqueue(url + page);
      });

      it('should have no broken links', function() {
        expect(this.broken, report(this.broken)).to.be.an('object').and.to.be.empty;
      });
    }));
  });

  describe('on error pages', () => {
    [ // eslint-disable-line array-bracket-spacing
      '/details/123',                               // 404
      '/audit/user-activity/?from=010111&to=010112' // 500
    ].forEach(page => describe(page, function() {
      before('run check', function(done) {
        this.broken = {};
        checker(false, this, done).scan(browser.url(url + page).getHTML('html'), url);
      });

      it('should have no broken links', function() {
        expect(this.broken, report(this.broken)).to.be.an('object').and.to.be.empty;
      });
    }));
  });

});
