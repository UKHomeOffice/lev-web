'use strict';

const moment = require('moment');
const testConfig = require('../../../test/acceptance/config');
const AuditSearchPage = require('../../pages/audit/AuditSearchPage');
const LoginPage = require('../../pages/LoginPage');
const env = testConfig.env;

const searchNoRecord = {
  from: '01/01/1800',
  to: '04/01/1800',
  user: env !== 'local' ? testConfig.username : 'lev-e2e-tests'
};

const searchValidRecord = {
  from: '23/12/2016',
  to: '24/12/2021',
  user: env !== 'local' ? testConfig.username : 'lev-e2e-tests'
};

describe('User Activity', () => {
  before(() => {
    LoginPage.login();
  });
  it('returns the report page', () => {
    AuditSearchPage.visit();
    AuditSearchPage.shouldBeVisible();
  });
  describe('submitting valid search dates with no user filtering', () => {
    describe('returning no audit data', () => {
      before(() => {
        AuditSearchPage.visit();
        AuditSearchPage.generateReport(searchNoRecord);
      });
      it('shows the User Activity page', () => {
        AuditSearchPage.shouldBeVisible();
      });
      it('displays an appropriate message advising no data could be found', () => {
        AuditSearchPage.noRecordsFound(searchNoRecord);
      });
    });
    describe('returning audit data', () => {
      // sets a 7-day report for testing
      const days = 7;
      const from = env !== 'local' ? moment().add(1 - days, 'days').format('DD/MM/YYYY') : '23/12/2016';
      const to = env !== 'local' ? moment().format('DD/MM/YYYY') :
        moment(from, 'DD/MM/YYYY').add(days - 1, 'days').format('DD/MM/YYYY');
      before(() => {
        AuditSearchPage.visit();
        AuditSearchPage.generateReport({ from, to });
      });

      it('shows the User Activity report page', () => {
        AuditSearchPage.shouldBeVisible();
      });

      it('displays an appropriate message including the search dates', () => {
        AuditSearchPage.validRecordFound({ from, to });
      });
      describe('contains a checkbox to toggle weekend visibility', () => {
        it('weekend days should be hidden by default', () => {
          AuditSearchPage.checkboxTicked(false);
          AuditSearchPage.weekDayRecordsDisplayed({ from, to });
        });
        it('clicking the checkbox should show the weekend days', () => {
          AuditSearchPage.toggleWeekendViewCheckbox();
          AuditSearchPage.checkboxTicked(true);
          AuditSearchPage.weekDayandWeekendRecordsDisplayed({ from, to });
        });
        it('clicking the checkbox again should hide the weekend days again', () => {
          AuditSearchPage.toggleWeekendViewCheckbox();
          AuditSearchPage.checkboxTicked(false);
          AuditSearchPage.weekDayRecordsDisplayed({ from, to });
        });
      });
      describe('displays a table with search counts for each user', () => {
        before('make sure the weekend days are showing so the totals are correct', () => {
          AuditSearchPage.checkboxTicked() || AuditSearchPage.toggleWeekendViewCheckbox();
        });

        it('the username ahould be displayed in the row of users', () => {
          AuditSearchPage.userDisplayed(searchValidRecord.user);
        });
        it('each row should have a column for each day plus a search count', () => {
          AuditSearchPage.columnForEachDayWithCount();
        });
      });
      describe('the last row of the table shows the daily total count for all users', () => {
        it('the row should be labeled "Day totals"', () => {
          AuditSearchPage.lastRowDayTotals();
        });
        it('the day totals should be accurate', () => {
          AuditSearchPage.dayTotalsAccurate();
        });
      });
      describe('the last column of the table shows the period total for user', () => {
        it('the period totals should be accurate for a user', () => {
          AuditSearchPage.periodTotalsAccurate();
        });
      });
      describe('download link', () => {
        it('link is on the page', () => {
          AuditSearchPage.downloadLinkDisplayed();
        });
        it('with a "download" attribute containing the filename', () => {
          AuditSearchPage.downloadLink({ from, to });
        });
      });
    });
    describe('using the "fast entry" date format', () => {
      const from = env !== 'local' ? moment() : moment('231216', 'DDMMYY');
      const to = moment(from).add(3, 'days');

      before(() => {
        AuditSearchPage.visit();
        AuditSearchPage.generateReport({ from: from.format('DDMMYY'), to: to.format('DDMMYY') });
      });

      it('shows the User Activity report page', () => {
        AuditSearchPage.shouldBeVisible();
      });

      it('displays an appropriate message including the search dates', () => {
        AuditSearchPage.validRecordFound({ from: from.format('DD/MM/YYYY'), to: to.format('DD/MM/YYYY') });
      });
    });
    describe('adding a user filter', () => {
      describe('returning no audit data', () => {
        before(() => {
          AuditSearchPage.visit();
          AuditSearchPage.generateReport(searchNoRecord);
        });
        it('shows the User Activity page', () => {
          AuditSearchPage.shouldBeVisible();
        });
        it('displays an appropriate message advising no data could be found', () => {
          AuditSearchPage.noRecordsFound(searchNoRecord);
        });
      });
      describe('returning audit data', () => {
        const from = env !== 'local' ? moment().format('DD/MM/YYYY') : '23/12/2016';
        const to = env !== 'local' ? moment().add(3, 'days').format('DD/MM/YYYY') : '26/12/2016';
        before(() => {
          AuditSearchPage.visit();
          AuditSearchPage.generateReport({ from, to, user: searchValidRecord.user });
        });
        it('shows the User Activity report page', () => {
          AuditSearchPage.shouldBeVisible();
        });
        it('displays an appropriate message including the user filter value', () => {
          AuditSearchPage.validRecordFound({ from, to, user: searchValidRecord.user });
        });
        it('shows only two rows only', () => {
          AuditSearchPage.singleRecordDisplayed();
        });
        it('with a row for the user', () => {
          AuditSearchPage.userDisplayed(searchValidRecord.user);
        });
        it('with a row for the totals', () => {
          AuditSearchPage.lastRowDayTotals();
        });
        describe('download link', () => {
          it('link is on the page', () => {
            AuditSearchPage.downloadLinkDisplayed();
          });
          it('with a "download" attribute containing the filename', () => {
            AuditSearchPage.downloadLink({ from, to, user: searchValidRecord.user });
          });
        });
      });
      describe('submitting an invalid query', () => {
        describe('with all fields empty', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: '', to: '' });
          });
          it('displays an error message and requests a to and from date', () => {
            AuditSearchPage.noDateSearchCriteria();
          });
        });
        describe('with all fields empty', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: '', to: '', user: 'some-dude' });
          });
          it('displays an error message and requests a to and from date', () => {
            AuditSearchPage.noDateSearchCriteria();
          });
        });
        describe('with improper dates', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: 'hell', to: 'back' });
          });
          it('displays an error message and requests a to and from date in the correct format', () => {
            AuditSearchPage.invalidDates();
          });
        });
        describe('with invalid dates', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: '29/02/2015', to: '31/02/2016' });
          });
          it('displays an error message and requests a to and from date in the correct format', () => {
            AuditSearchPage.invalidDates();
          });
        });
        describe('with a from date in the future', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: moment().add(2, 'days').format('DD/MM/YYYY'),
              to: moment().add(5, 'days').format('DD/MM/YYYY') });
          });
          it('displays an error message and requests a date in the past', () => {
            AuditSearchPage.dateInFuture();
          });
        });
        describe('with a "from" date after the "to" date', () => {
          before(() => {
            AuditSearchPage.visit();
            AuditSearchPage.generateReport({ from: moment().add(-3, 'day').format('DD/MM/YYYY'),
              to: moment().add(-10, 'days').format('DD/MM/YYYY') });
          });

          it('displays an error message and requests a past date', () => {
            AuditSearchPage.fromDateAfterToDate();
          });
          describe(`with a date range greater than ${testConfig.MAX_AUDIT_RANGE} days`, () => {
            before(() => {
              AuditSearchPage.visit();
              AuditSearchPage.generateReport({
                from: moment().subtract(testConfig.MAX_AUDIT_RANGE + 1, 'days').format('DD/MM/YYYY'),
                to: moment().format('DD/MM/YYYY')
              });
            });
            it('requests a reduced date range', () => {
              AuditSearchPage.exceedMaxRange(testConfig.MAX_AUDIT_RANGE);
            });
          });
          describe('with invalid characters in the user search filter', () => {
            before(() => {
              AuditSearchPage.visit();
              AuditSearchPage.generateReport({
                to: moment().add(-10, 'days').format('DD/MM/YYYY'),
                from: moment().add(-3, 'day').format('DD/MM/YYYY'),
                user: 'this won\'t work!'
              });
            });
            it('displays an error message and requests a user with valid characters', () => {
              AuditSearchPage.userInvalidCharacters();
            });
          });
        });
      });
    });
  });
});


