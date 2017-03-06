'use strict';

const moment = require('moment');

describe('User Activity', () => {
  before(() => {
    browser.goToUserActivityReport();
  });

  it('returns the report page', () => {
    browser.shouldBeOnUserActivityReport();
  });

  describe('submitting valid search dates', () => {
    describe('returning no audit data', () => {
      const from = '01/01/1800';
      const to = '01/01/1900';

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
      const from = '23/12/2016';
      const to = '26/12/2016';
      let columns;
      let userCounts;

      before(() => {
        browser.generateReport(from, to);
      });

      it('shows the User Activity report page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message including the search dates', () => {
        const h2 = `Showing audit data from ${from}, to ${to}`;
        browser.getText('h2').should.equal(h2);
        columns = browser.getText('table.audit > tbody > tr > *');
      });

      describe('displays a table with search counts for each user', () => {
        it('each row should display the username', () => {
          columns.shift().should.equal('lev-e2e-tests');
        });

        it('each row should have a column for each day with the search count in', () => {
          (userCounts = columns.splice(0, Math.floor(columns.length / 2))
            .map(c => c ? parseInt(c, 10) : 0)).should.not.throwError;
        });

        it('each row should have a search count total for the user as the last column', () => {
          userCounts.pop().should.equal(userCounts.reduce((t, c) => t + c));
        });
      });

      describe('the last row of the table shows the total counts for all users', () => {
        let totals;

        it('the row should be labeled "Day totals"', () => {
          columns.shift().should.equal('Day totals');
        });

        it('the row should have a column for each day with the total search count', () => {
          (totals = columns.map(c => c ? parseInt(c, 10) : 0)).should.not.throwError;
        });

        it('the totals should be accurate', () => {
          totals.pop().should.equal(totals.reduce((t, c) => t + c));
          userCounts.should.deep.equal(totals);
        });
      });

      describe('contains a checkbox to toggle weekend visibility', () => {
        let checkbox;

        it('weekend days should be hidden by default', () => {
          checkbox = browser.element('#weekends');
          browser.isSelected('#weekends').should.be.false;
          const tableHeaders = browser.getText('table.audit > thead > tr');
          tableHeaders.should.have.string('23 Dec 2016');
          tableHeaders.should.not.have.string('24 Dec 2016');
          tableHeaders.should.not.have.string('25 Dec 2016');
          tableHeaders.should.have.string('26 Dec 2016');
          tableHeaders.should.have.string('Period total');
        });

        it('clicking the checkbox should show the weekend days', () => {
          checkbox.click();
          const tableHeaders = browser.getText('table.audit > thead > tr');
          tableHeaders.should.have.string('23 Dec 2016');
          tableHeaders.should.have.string('24 Dec 2016');
          tableHeaders.should.have.string('25 Dec 2016');
          tableHeaders.should.have.string('26 Dec 2016');
          tableHeaders.should.have.string('Period total');
        });

        it('clicking the checkbox again should hide the weekend days again', () => {
          checkbox.click();
          const tableHeaders = browser.getText('table.audit > thead > tr');
          tableHeaders.should.have.string('23 Dec 2016');
          tableHeaders.should.not.have.string('24 Dec 2016');
          tableHeaders.should.not.have.string('25 Dec 2016');
          tableHeaders.should.have.string('26 Dec 2016');
          tableHeaders.should.have.string('Period total');
        });
      });
    });

    describe('using the "fast entry" date format', () => {
      const from = '23122016';
      const to = '26122016';

      before(() => {
        browser.generateReport(from, to);
      });

      it('shows the User Activity report page', () => {
        browser.shouldBeOnUserActivityReport();
      });

      it('displays an appropriate message including the search dates', () => {
        const h2 = 'Showing audit data from 23/12/2016, to 26/12/2016';
        browser.getText('h2').should.equal(h2);
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

    // placeholder test for making search date range check part of validation, instead of a 500 error
    describe.skip('with a "from" date after the "to" date', () => {
      before(() => {
        browser.generateReport(
          moment().add(-3, 'day').format('DD/MM/YYYY'),
          moment().add(-10, 'days').format('DD/MM/YYYY')
        );
      });

      it('displays an error message', () => {
        browser.getText('h2').should.contain('Fix the following error');
      });

      it('requests a past date', () => {
        browser.getText('a').should.contain('Please enter a proper date range');
      });
    });

  });
});
