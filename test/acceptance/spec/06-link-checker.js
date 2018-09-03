'use strict';

const blc = require('broken-link-checker');
const { url } = require('../config');

const report = bl => `Broken links found:\n${Object.keys(bl).map(t => `\t- target: ${t}, ${bl[t]}`).join('\n')}\n`;

describe('Check for broken links', () => {

  [ // eslint-disable-line array-bracket-spacing
    '/',                                              // the search page
    '/?system-123',                                   // the search page (with help image displayed)
    '/?surname=multiple&forenames=tester&dob=010110', // the results page
    '/details/123456789',                             // the details page
    '/audit/user-activity/?from=010118&to=210118'     // the audit page
  ].forEach(page => describe(page, function() {
    before('run check', function(done) {
      this.broken = {};
      const siteChecker = new blc.SiteChecker({
        filterLevel: 3,
        excludedKeywords: ['*/oauth/logout']
      }, {
        link: l => {
          if (l.broken && !this.broken[l.url.resolved]) {
            this.broken[l.url.resolved] = `found on page: ${l.base.resolved}, with selector: "${l.html.selector}"`;
          }
        },
        end: done
      });
      siteChecker.enqueue(url + page);
    });

    it('should have no broken links', function() {
      expect(this.broken, report(this.broken)).to.be.an('object').and.to.be.empty;
    });
  }));

});
