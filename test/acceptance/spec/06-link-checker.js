'use strict';

const blc = require('broken-link-checker');
const { url } = require('../config');

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
      this.brokenLinks = new Set();
      const siteChecker = new blc.SiteChecker({
        filterLevel: 3,
        excludedKeywords: ['*/oauth/logout']
      }, {
        link: l => l.broken && this.brokenLinks.add(l.url.resolved),
        end: err => {
          this.brokenLinks = Array.from(this.brokenLinks.values());
          done(err);
        }
      });
      siteChecker.enqueue(url + page);
    });

    it('should have no broken links', function() {
      expect(this.brokenLinks,
        `${page} has the following broken links:${this.brokenLinks.map(l => `\n\t- ${l}`)}\n`)
        .to.be.an('array').and.to.be.empty;
    });
  }));

});
