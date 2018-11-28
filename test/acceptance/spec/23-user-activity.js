'use strict';

const moment = require('moment');
const testConfig = require('../config');
const env = testConfig.env;

describe('User Activity', () => {
  const user = env !== 'local' ? testConfig.username : 'lev-e2e-tests';

  before(() => {
    browser.goToUserActivityReport();
  });

  it('returns the report page', () => {
    browser.shouldBeOnUserActivityReport();
  });

  describe('submitting valid search dates', () => {
    describe('returning no audit data', () => {
      const from = '01/01/1800';
      const to = '01/04/1800';

      before(() => {
        browser.generateReport(from, to);
      });

      it('shows the User Activity page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message advising no data could be found', () => {
        browser.getText('h2').should.equal(`No usage data found between ${from} and ${to}`);
      });
    });

    describe('returning audit data', () => {
      const days = 7;
      const from = env !== 'local' ? moment().add(1 - days, 'days').format('DD/MM/YYYY') : '23/12/2016';
      const to = env !== 'local' ? moment().format('DD/MM/YYYY') :
        moment(from, 'DD/MM/YYYY').add(days - 1, 'days').format('DD/MM/YYYY');
      let columns;
      let userCounts = [];

      before(() => {
        browser.generateReport(from, to);
      });

      it('shows the User Activity report page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message including the search dates', () => {
        const h2 = `Showing audit data from ${from}, to ${to}`;
        browser.getText('h2').should.equal(h2);
      });

      describe('contains a checkbox to toggle weekend visibility', () => {
        let checkbox;
        const isWeekend = date => date.format('ddd')[0].toLowerCase() === 's';

        it('weekend days should be hidden by default', () => {
          checkbox = browser.element('#weekends');
          browser.isSelected('#weekends').should.be.false;
          const tableHeaders = browser.getText('table.audit > thead > tr');
          const cursor = moment(from, 'DD/MM/YYYY');
          let i = 0;
          while (i++ < days) {
            if (isWeekend(cursor)) {
              tableHeaders.should.not.have.string(cursor.format('D MMM YYYY'));
            } else {
              tableHeaders.should.have.string(cursor.format('D MMM YYYY'));
            }
            cursor.add(1, 'days');
          }
          tableHeaders.should.have.string('Period total');
        });

        it('clicking the checkbox should show the weekend days', () => {
          checkbox.click();
          const tableHeaders = browser.getText('table.audit > thead > tr');
          const cursor = moment(from, 'DD/MM/YYYY');
          let i = 0;
          while (i++ < days) {
            tableHeaders.should.have.string(cursor.format('D MMM YYYY'));
            cursor.add(1, 'days');
          }
          tableHeaders.should.have.string('Period total');
        });

        it('clicking the checkbox again should hide the weekend days again', () => {
          checkbox.click();
          const tableHeaders = browser.getText('table.audit > thead > tr');
          const cursor = moment(from, 'DD/MM/YYYY');
          let i = 0;
          while (i++ < days) {
            if (isWeekend(cursor)) {
              tableHeaders.should.not.have.string(cursor.format('D MMM YYYY'));
            } else {
              tableHeaders.should.have.string(cursor.format('D MMM YYYY'));
            }
            cursor.add(1, 'days');
          }
          tableHeaders.should.have.string('Period total');
        });
      });

      describe('displays a table with search counts for each user', () => {
        before('make sure the weekend days are showing so the totals are correct', () => {
          const checkbox = browser.element('#weekends');
          if (!browser.isSelected('#weekends')) {
            checkbox.click();
          }
          columns = browser.$$('table.audit > tbody > tr > *').map(c => c.getText());
        });

        it('each row should display the username', () => {
          columns.should.contain(user);
        });

        it('each row should have a column for each day with the search count', () => {
          while (columns[0] !== 'Day totals') {
            columns.shift();
            let row = columns.splice(0, days + 1);
            let counts = row.map(c => c ? parseInt(c, 10) : 0);
            (userCounts = userCounts.concat([counts])).should.not.throw;
          }
        });

        it('each row should have a search count total for the user as the last column', () => {
          userCounts.forEach(uc =>
            uc.slice(0, days).reduce((t, c) => t + c, 0).should.equal(uc[uc.length - 1]));
        });
      });

      describe('the last row of the table shows the total counts for all users', () => {
        let totals;

        it('the row should be labeled "Day totals"', () => {
          columns.shift().should.equal('Day totals');
        });

        it('the row should have a column for each day with the total search count', () => {
          (totals = columns.map(c => c ? parseInt(c, 10) : 0)).should.not.throw;
        });

        it('the day totals should be accurate', () => {
          totals.forEach((t, i) => t.should.equal(userCounts.reduce((tc, uc) => tc + uc[i], 0)));
        });

        it('the grand total should be accurate', () => {
          totals.slice(0, days).reduce((t, c) => t + c, 0).should.equal(totals[totals.length - 1]);
        });
      });

      describe('displays a download link', function() {
        before(() => {
          this.link = browser.element('a#save');
        });

        it('on the page', () => {
          this.link.should.exist;
        });

        it('with a "download" attribute containing the filename', () => {
          const fromDshd = moment(from, 'DD/MM/YYYY').format('DD-MM-YY');
          const toDshd = moment(to, 'DD/MM/YYYY').format('DD-MM-YY');
          this.link.getAttribute('download').should.equal(`audit_report_${fromDshd}_to_${toDshd}.csv`);
        });
      });
    });

    describe('using the "fast entry" date format', () => {
      const from = env !== 'local' ? moment() : moment('231216', 'DDMMYY');
      const to = moment(from).add(3, 'days');

      before(() => {
        browser.generateReport(from.format('DDMMYY'), to.format('DDMMYY'));
      });

      it('shows the User Activity report page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message including the search dates', () => {
        const h2 = `Showing audit data from ${from.format('DD/MM/YYYY')}, to ${to.format('DD/MM/YYYY')}`;
        browser.getText('h2').should.equal(h2);
      });
    });
  });

  describe('adding a user filter', () => {
    describe('returning no audit data', () => {
      const from = '01/01/1800';
      const to = '01/04/1800';

      before(() => {
        browser.generateReport(from, to, user);
      });

      it('shows the User Activity page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message advising no data could be found', () => {
        browser.getText('h2').should.equal(`No usage data for '${user}' found between ${from} and ${to}`);
      });
    });

    describe('returning audit data', () => {
      const from = env !== 'local' ? moment().format('DD/MM/YYYY') : '23/12/2016';
      const to = env !== 'local' ? moment().add(3, 'days').format('DD/MM/YYYY') : '26/12/2016';

      before(() => {
        browser.generateReport(from, to, user);
      });

      it('shows the User Activity report page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message including the user filter value', () => {
        const h2 = `Showing audit data for '${user}' from ${from}, to ${to}`;
        browser.getText('h2').should.equal(h2);
      });

      describe('displays the search count table', () => {
        let rowHeaders;

        before('get the row headers', () => {
          rowHeaders = browser.getText('table.audit > tbody > tr > th');
        });

        it('with two rows only', () => {
          rowHeaders.length.should.equal(2);
        });

        it('with a row for the user', () => {
          rowHeaders[0].should.equal(user);
        });

        it('with a row for the totals', () => {
          rowHeaders[1].should.equal('Day totals');
        });
      });

      describe('displays a download link', function() {
        before(() => {
          this.link = browser.element('a#save');
        });

        it('on the page', () => {
          this.link.should.exist;
        });

        it('with a "download" attribute containing the filename', () => {
          const fromDshd = moment(from, 'DD/MM/YYYY').format('DD-MM-YY');
          const toDshd = moment(to, 'DD/MM/YYYY').format('DD-MM-YY');
          this.link.getAttribute('download').should.equal(`audit_report_for_${user}_${fromDshd}_to_${toDshd}.csv`);
        });
      });
    });
  });

  describe('submitting an invalid query', () => {
    describe('with all fields empty', () => {
      before(() => {
        browser.generateReport('', '');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a "from" date', () => {
        browser.getText('a').should.contain('Please enter a date to search from');
      });

      it('requests a "to" date', () => {
        browser.getText('a').should.contain('Please enter a date to search up to');
      });
    });

    describe('with the date range fields empty', () => {
      before(() => {
        browser.generateReport('', '', 'some-dude');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a "from" date', () => {
        browser.getText('a').should.contain('Please enter a date to search from');
      });

      it('requests a "to" date', () => {
        browser.getText('a').should.contain('Please enter a date to search up to');
      });
    });

    describe('with improper dates', () => {
      before(() => {
        browser.generateReport('christmas', 'easter');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a proper "from" date', () => {
        browser.getText('a').should.contain('Please enter the "from" date in the correct format');
      });

      it('requests a proper "to" date', () => {
        browser.getText('a').should.contain('Please enter the "to" date in the correct format');
      });
    });

    describe('with invalid dates', () => {
      before(() => {
        browser.generateReport('29/02/2015', '31/02/2016');
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a proper "from" date', () => {
        browser.getText('a').should.contain('Please enter the "from" date in the correct format');
      });

      it('requests a proper "to" date', () => {
        browser.getText('a').should.contain('Please enter the "to" date in the correct format');
      });
    });

    describe('with a from date in the future', () => {
      before(() => {
        browser.generateReport(
          moment().add(2, 'days').format('DD/MM/YYYY'),
          moment().add(5, 'days').format('DD/MM/YYYY')
        );
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a "from" date in the past', () => {
        browser.getText('a').should.contain('Please enter a date in the past');
      });
    });

    // temporary test checks error page works as expected, should eventually be replaced by the next (skipped) test
    describe('with a "from" date after the "to" date', () => {
      before(() => {
        browser.generateReport(
          moment().add(-3, 'day').format('DD/MM/YYYY'),
          moment().add(-10, 'days').format('DD/MM/YYYY')
        );
      });

      it('displays an error message', () => browser.getText('h1').should.equal('Error'));
      it('requests a past date', () =>
        browser.getText('p').should.equal('"from" date must be before "to" date for the User Activity report'));
    });

    // placeholder test for making search date range check part of validation, instead of a 500 error
    describe.skip('with a "from" date after the "to" date', () => {
      before(() => {
        browser.generateReport(
          moment().add(-3, 'day').format('DD/MM/YYYY'),
          moment().add(-10, 'days').format('DD/MM/YYYY')
        );
      });

      it('displays an error message', () => browser.getText('h2').should.contain('Fix the following error'));
      it('requests a past date', () => browser.getText('a').should.contain('Please enter a proper date range'));
    });

    // temporary test checks error page works as expected, should eventually be replaced by the next (skipped) test
    describe(`with a date range greater than ${testConfig.MAX_AUDIT_RANGE} days`, () => {
      before(() => {
        browser.generateReport(
          moment().subtract(testConfig.MAX_AUDIT_RANGE + 1, 'days').format('DD/MM/YYYY'),
          moment().format('DD/MM/YYYY')
        );
      });

      it('displays an error message', () => browser.getText('h1').should.equal('Error'));
      it('requests a reduced date range', () => browser.getText('p').should.equal(
        `maximum date range exceeded (should be less than ${testConfig.MAX_AUDIT_RANGE} days)`));
    });

    describe('with invalid characters in the user search filter', () => {
      before(() => {
        browser.generateReport(
          moment().add(-10, 'days').format('DD/MM/YYYY'),
          moment().add(-3, 'day').format('DD/MM/YYYY'),
          'this won\'t work!'
        );
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a past date', () => {
        browser.getText('a').should.contain(
          'Please only use characters that can be used for an email address: a-z, A-Z, 0-9, or \'_%-@.\'');
      });
    });

  });
});
