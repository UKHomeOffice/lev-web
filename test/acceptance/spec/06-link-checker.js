'use strict';

const blc = require('broken-link-checker');
const { url } = require('../config');

const checkLinks = isErrorPage => page => describe(page, function() {
  before('run check', function(done) {
    this.broken = {};

    const fullUrl = url + page;
    const Checker = isErrorPage ? blc.HtmlChecker : blc.SiteChecker;
    const checker = new Checker({
      filterLevel: 3,
      excludedKeywords: ['*/oauth/logout']
    }, {
      link: l => {
        if (l.broken && !this.broken[l.url.resolved]) {
          this.broken[l.url.resolved] = `found on page: ${l.base.resolved}, with selector: "${l.html.selector}"`;
        }
      },
      site: (e, url2) => e && done(new Error(`${e.message} - code: ${e.code || e.status || e.statusCode} ${url2}`)),
      end: done,
      complete: done
    });

    isErrorPage ? checker.scan(browser.url(fullUrl).getHTML('html'), url) : checker.enqueue(fullUrl);
  });

  it('should have no broken links', function() {
    const broken = Object.keys(this.broken).map(t => `\t- target: ${t}, ${this.broken[t]}`);
    const report = 'Broken links found:\n' + broken.join('\n') + '\n';
    expect(this.broken, report).to.be.an('object').and.to.be.empty;
  });
});

describe('Check for broken links', () => {
  /* eslint-disable array-bracket-spacing, no-inline-comments */
  describe('on regular pages', () => {
    [
      '/',                                              // the search page
      '/?system-123',                                   // the search page (with help image displayed)
      '/?surname=multiple&forenames=tester&dob=010110', // the results page
      '/details/123456789',                             // the details page
      '/audit/user-activity/?from=010118&to=210118'     // the audit page
    ].forEach(checkLinks(false));
  });

  describe('on error pages', () => {
    [
      '/details/123',                               // 404
      '/audit/user-activity/?from=010111&to=010112' // 500
    ].forEach(checkLinks(true));
  });
  /* eslint-enable array-bracket-spacing, no-inline-comments */
});
