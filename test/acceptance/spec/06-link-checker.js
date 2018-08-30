'use strict';

const blc = require('broken-link-checker');
const { url } = require('../config');

const report = bl => `Broken links found:\n${Object.keys(bl).map(t => `\t- target: ${t}, ${bl[t]}`).join('\n')}\n`;

describe('Check for broken links', () => {

  [ // eslint-disable-line array-bracket-spacing
    '/',
    '/?surname=multiple&forenames=tester&dob=010110',
    '/details/123456789',
    '/?system-number=100000000',
    '/audit/user-activity/?from=010118&to=210618',
    '/audit/user-activity/?from=010118&to=210118'
  ].forEach(page => describe(page, function() {
    before('run check', function(done) {
      this.brokenLinks = {};
      const siteChecker = new blc.SiteChecker({
        filterLevel: 3,
        excludedKeywords: ['*/oauth/logout']
      }, {
        link: l => {
          if (l.broken && !this.brokenLinks[l.url.resolved]) {
            this.brokenLinks[l.url.resolved] = `found on page: ${l.base.resolved}, with selector: "${l.html.selector}"`;
          }
        },
        end: done
      });
      siteChecker.enqueue(url + page);
    });

    it('should have no broken links', function() {
      expect(this.brokenLinks, report(this.brokenLinks)).to.be.an('object').and.to.be.empty;
    });
  }));

});
