'use strict';

const proxyquire = require('proxyquire');
const reqres = require('reqres');
const moment = require('moment');
const rewire = require('rewire');
var _ = require('lodash');

const auditController = rewire('../../../controllers/audit');
/* eslint-disable no-underscore-dangle */
const dayGenerator = auditController.__get__('dayGenerator');
const daysInDateRange = auditController.__get__('daysInDateRange');
const addClasses = auditController.__get__('addClasses');
const initDayTotals = auditController.__get__('initDayTotals');
const numberWang = auditController.__get__('numberWang');
const expandUsers = auditController.__get__('expandUsers');
/* eslint-enable no-underscore-dangle */

const api = {
  userActivityReport: sinon.stub()
};
const controller = proxyquire('../../../controllers/audit', {
  '../api': api
});

const momentMatcher = date => sinon.match(value => date.isSame(value), `did not match date: ${date}`);

describe('Audit Controller', () => {

  it('is a function', () => {
    controller.should.be.a('function');
  });

  beforeEach(() => {
    api.userActivityReport.reset();
  });

  describe('middleware', () => {
    let res;

    beforeEach(() => {
      res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };
    });

    describe('when there is no query string', () => {
      let req;

      beforeEach(() => {
        req = reqres.req();
      });

      it('renders the user activity report page', () => {
        controller(req, res);
        res.render.should.have.been.calledWith('pages/user-activity');
      });
    });

    describe('when there is a query string', () => {
      let req;
      const loggedOnUser = 'mrs-caseworker';

      beforeEach(() => {
        req = _.extend(reqres.req(), {
          body: undefined,
          headers: {
            'X-Auth-Username': loggedOnUser
          },
          method: 'GET'
        });
      });

      describe('the resolved promise', () => {
        describe('renders a special page when no data is found', () => {
          it('with the search dates displayed', (done) => {
            req.query = {
              from: '01/01/1800',
              to: '01/01/1900'
            };
            const toAdjusted = '02/01/1900';
            const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
            const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
            api.userActivityReport.withArgs(loggedOnUser, matchFrom, matchTo).returns(Promise.resolve({}));

            res.render = (view, data) => {
              try {
                view.should.equal('pages/user-activity');
                data.should.deep.equal({
                  from: req.query.from,
                  to: req.query.to,
                  naudit: true,
                  user: ''
                });
                done();
              } catch (err) {
                done(err);
              }
            };

            controller(req, res);
          });

          it('and displays the user search value', (done) => {
            req.query = {
              from: '02/03/1800',
              to: '02/03/1900',
              user: 'mr_user'
            };
            const toAdjusted = '03/03/1900';
            const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
            const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
            api.userActivityReport.withArgs(loggedOnUser, matchFrom, matchTo, req.query.user)
              .returns(Promise.resolve({}));

            res.render = (view, data) => {
              try {
                view.should.equal('pages/user-activity');
                data.should.deep.equal({
                  from: req.query.from,
                  to: req.query.to,
                  user: req.query.user,
                  naudit: true
                });
                done();
              } catch (err) {
                done(err);
              }
            };

            controller(req, res);
          });
        });

        describe('otherwise renders the report table', () => {
          it('including a message with the dates', (done) => {
            const records = {
              amanda: { '2017-02-02': 3 },
              colin: { '2017-02-03': 7 }
            };
            req.query = {
              from: '02/02/2017',
              to: '03/02/2017'
            };
            const toAdjusted = '04/02/2017';
            const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
            const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
            api.userActivityReport.withArgs('mrs-caseworker', matchFrom, matchTo).returns(Promise.resolve(records));

            res.render = (view, data) => {
              try {
                view.should.equal('pages/user-activity');
                data.should.deep.equal({
                  from: req.query.from,
                  to: req.query.to,
                  user: '',
                  audit: {
                    dates: [
                      { classes: '', date: '2017-02-02', day: '2', month: 'Feb', year: '2017' },
                      { classes: '', date: '2017-02-03', day: '3', month: 'Feb', year: '2017' }
                    ],
                    usage: [ /* eslint-disable no-multi-spaces */
                      { user: 'amanda',     searches: [{ count: 2    }, { count: null }, { count: 2 }] },
                      { user: 'colin',      searches: [{ count: null }, { count: 4    }, { count: 4 }] },
                      { user: 'Day totals', searches: [{ count: 2    }, { count: 4    }, { count: 6 }] }
                    ] /* eslint-enable no-multi-spaces */
                  }
                });
                done();
              } catch (err) {
                done(err);
              }
            };

            controller(req, res);
          });

          it('and displays the user search value', (done) => {
            const records = {
              amanda: { '2017-02-02': 3 },
              colin: { '2017-02-03': 7 }
            };
            req.query = {
              from: '02/02/2017',
              to: '03/02/2017',
              user: 'mr_user'
            };
            const toAdjusted = '04/02/2017';
            const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
            const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
            api.userActivityReport.withArgs('mrs-caseworker', matchFrom, matchTo, req.query.user)
              .returns(Promise.resolve(records));

            res.render = (view, data) => {
              try {
                view.should.equal('pages/user-activity');
                data.should.have.property('user', req.query.user);
                done();
              } catch (err) {
                done(err);
              }
            };

            controller(req, res);
          });
        });
      });

      describe('a rejected promise due to an error', () => {
        it('passes on to the error handler', (done) => {
          req.query = {
            from: '20/01/2016',
            to: '15/01/2016'
          };
          const err = new Error({
            name: 'UnexpectedError'
          });
          const toAdjusted = '16/01/2016';
          const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
          const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
          api.userActivityReport.withArgs('mrs-caseworker', matchFrom, matchTo).returns(Promise.reject(err));

          const next = (error) => {
            try {
              error.should.equal(err);
              done();
            } catch (failure) {
              done(failure);
            }
          };

          controller(req, res, next);
        });

        it('wraps non-error objects before passing to the error handler', (done) => {
          req.query = {
            from: '10/01/2009',
            to: '20/01/2009'
          };
          const err = new Error('UnexpectedError');
          const toAdjusted = '21/01/2009';
          const matchFrom = sinon.match.object.and(momentMatcher(moment(req.query.from, 'DD/MM/YYYY')));
          const matchTo = sinon.match.object.and(momentMatcher(moment(toAdjusted, 'DD/MM/YYYY')));
          api.userActivityReport.withArgs('mrs-caseworker', matchFrom, matchTo).returns(Promise.reject(err.message));

          const next = (error) => {
            try {
              error.should.deep.equal(err);
              done();
            } catch (failure) {
              done(failure);
            }
          };

          controller(req, res, next);
        });
      });

    });

  });

  describe('helper function', () => {

    describe('#dayGenerator', () => {
      it('should return the days between the specified "from" and "to" dates', () => {
        const gen = dayGenerator(moment('2016-12-30'), moment('2017-01-02 12:03:54'));

        let obj = gen.next();
        expect(obj).to.be.an('object');

        const checkDay = date => {
          expect(obj.value).to.be.an('object');
          expect(obj.value.date).to.equal(date);
          expect(obj.done).to.be.false;
          obj = gen.next();
        };
        checkDay('2016-12-30');
        checkDay('2016-12-31');
        checkDay('2017-01-01');
        checkDay('2017-01-02');

        expect(obj.value).to.be.undefined;
        expect(obj.done).to.be.true;
      });

      describe('the day objects returned', () => {
        const day = '31';
        const month = '12';
        const year = '2016';
        const obj = dayGenerator(moment(`${year}-${month}-${day}`), moment('2017-01-01')).next().value;

        it('should have a field for the day', () => {
          expect(obj).to.have.property('day', day);
        });
        it('should have a field for the month', () => {
          expect(obj).to.have.property('month', 'Dec');
        });
        it('should have a field for the year', () => {
          expect(obj).to.have.property('year', year);
        });
      });

      describe('the day object returned has a "classes" array which', () => {
        it('should contain the "weekend" class only if the day is on the weekend', () => {
          const gen = dayGenerator(moment('2017-02-02'), moment('2017-02-13 12:30'));
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', 'weekend');
          expect(gen.next().value).to.have.property('classes', 'weekend');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', 'weekend');
          expect(gen.next().value).to.have.property('classes', 'weekend');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().done).to.be.true;
        });

        it('should contain the "first" class only if the day is the first of the month', () => {
          const gen = dayGenerator(moment('2017-02-28'), moment('2017-03-03 12:30'));
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', 'first');
          expect(gen.next().value).to.have.property('classes', '');
          expect(gen.next().value).to.have.property('classes', '');
        });
      });
    });

    describe('#daysInDateRange', () => {
      it('should return an array of day objects', () => {
        const days = daysInDateRange(moment('2017-01-01'), moment('2017-01-01 13:01'));
        expect(days).to.deep.equal([{
          day: '1',
          month: 'Jan',
          year: '2017',
          date: '2017-01-01',
          classes: 'weekend first'
        }]);
      });

      it('should return an array of day objects between the specified dates', () => {
        const days = daysInDateRange(moment('2017-01-01'), moment('2017-01-05'));
        let i = 0;
        expect(days).to.have.lengthOf(4);
        expect(days[i++]).to.have.property('date', `2017-01-0${i}`);
        expect(days[i++]).to.have.property('date', `2017-01-0${i}`);
        expect(days[i++]).to.have.property('date', `2017-01-0${i}`);
        expect(days[i++]).to.have.property('date', `2017-01-0${i}`);
      });
    });

    describe('#addClasses', () => {
      it('should add the classes from the source object to the target', () => {
        let source = { classes: 'some,classes' };
        let target = {};
        addClasses(source, target).should.deep.equal(source);
        source = { classes: 'blue' };
        target = { count: 14 };
        addClasses(source, target).should.deep.equal({
          count: target.count,
          classes: source.classes
        });
      });

      it('should not add a classes field when none are available', () => {
        addClasses({}, {}).should.deep.equal({});
        const source = { fu: 'bar' };
        const target = { other: 'bar' };
        addClasses(source, target).should.deep.equal(target);
      });
    });

    describe('#initDayTotals creates "day total" wrapper objects based on a specified set of "day" objects', () => {
      const days = [
        { },
        { classes: '' },
        { classes: 'first' }
      ];
      let totals;

      before(() => {
        totals = initDayTotals(days);
      });

      it('should add an extra object for the grand total', () => {
        totals.should.have.lengthOf(days.length + 1);
      });

      it('should create a list of objects with the count filed set to 0', () => {
        totals.every(t => t.count.should.equal(0));
      });

      it('should initialise the classes field only if classes are present', () => {
        totals.should.not.have.deep.property('[0].classes');
        totals.should.not.have.deep.property('[1].classes');
        totals.should.have.deep.property('[2].classes', days[2].classes);
        totals.should.not.have.deep.property('[3].classes');
      });
    });

    describe('#numberWang is a temporary fix to give a more accurate usage count for Nigel', () => {
      it('should be a function', () => {
        numberWang.should.be.a('function');
      });

      it('should half the raw count', () => {
        const rawCount = 4;
        numberWang(rawCount).should.equal(2);
      });

      it('should round fractions up', () => {
        const rawCount = 9;
        numberWang(rawCount).should.equal(5);
      });

      it('should correctly handle nulls', () => {
        numberWang(null).should.eql(0);
        numberWang(undefined).should.eql(0);
        numberWang().should.eql(0);
      });
    });

    describe('#expandDays creates "day total" wrapper objects based on a specified set of "day" objects', () => {
      const days = [
        { },
        { classes: '' },
        { classes: 'first' }
      ];
      let totals;

      before(() => {
        totals = initDayTotals(days);
      });

      it('should add an extra object for the grand total', () => {
        totals.should.have.lengthOf(days.length + 1);
      });

      it('should create a list of objects with the count filed set to 0', () => {
        totals.every(t => t.count.should.equal(0));
      });

      it('should initialise the classes field only if classes are present', () => {
        totals.should.not.have.deep.property('[0].classes');
        totals.should.not.have.deep.property('[1].classes');
        totals.should.have.deep.property('[2].classes', days[2].classes);
        totals.should.not.have.deep.property('[3].classes');
      });
    });

    describe('#expandUsers transforms the partial search count data from the API, into a complete 2D table', () => {
      const days = [
        { date: 'Monday' },
        { date: 'Tuesday' },
        { date: 'Wednesday' },
        { date: 'Thursday' },
        { date: 'Friday' }
      ];
      const wrapCount = count => ({ count: count });

      it('should pad days without searches with `null`s, and add a total', () => {
        const records = { 'bob': { Tuesday: 23, Thursday: 14 } };
        expect(expandUsers(records, days)[0]).to.deep.equal({
          user: 'bob',
          searches: [null, 12, null, 7, null, 19].map(wrapCount)
        });
      });
      it('should work for multiple users', () => {
        const records = {
          'bob': { Tuesday: 12 },
          'ian': { Tuesday: 2, Thursday: 3, Friday: 9 },
          'ann': { Monday: 23, Friday: 5 },
          'dil': { Tuesday: 3, Thursday: 14 }
        };
        expect(expandUsers(records, days).slice(0, -1)).to.deep.equal([
          { user: 'bob', searches: [null, 6, null, null, null, 6].map(wrapCount) },
          { user: 'ian', searches: [null, 1, null, 2, 5, 8].map(wrapCount) },
          { user: 'ann', searches: [12, null, null, null, 3, 15].map(wrapCount) },
          { user: 'dil', searches: [null, 2, null, 7, null, 9].map(wrapCount) }
        ]);
      });

      it('should add day totals', () => {
        const records = { 'bob': { Tuesday: 23, Thursday: 14 } };
        expect(expandUsers(records, days)).to.deep.equal([
          { user: 'bob', searches: [null, 12, null, 7, null, 19].map(wrapCount) },
          { user: 'Day totals', searches: [0, 12, 0, 7, 0, 19].map(wrapCount) }
        ]);
      });
      it('should work for multiple users', () => {
        const records = {
          'bob': { Tuesday: 12 },
          'ian': { Tuesday: 2, Thursday: 3, Friday: 9 },
          'ann': { Monday: 23, Friday: 5 },
          'dil': { Tuesday: 3, Thursday: 14 }
        };
        expect(expandUsers(records, days)).to.deep.equal([
          { user: 'bob', searches: [null, 6, null, null, null, 6].map(wrapCount) },
          { user: 'ian', searches: [null, 1, null, 2, 5, 8].map(wrapCount) },
          { user: 'ann', searches: [12, null, null, null, 3, 15].map(wrapCount) },
          { user: 'dil', searches: [null, 2, null, 7, null, 9].map(wrapCount) },
          { user: 'Day totals', searches: [12, 9, 0, 9, 8, 38].map(wrapCount) }
        ]);
      });
      it('should work for "real" data', () => {
        const dates = [{ date: '2017-01-20' }, { date: '2017-01-21' }, { date: '2017-01-22' },
          { date: '2017-01-23' }, { date: '2017-01-24' }, { date: '2017-01-25' }, { date: '2017-01-26' },
          { date: '2017-01-27' }];
        const records = {
          adam: { '2017-01-22': 21, '2017-01-23': 23, '2017-01-24': 35, '2017-01-25': 12, '2017-01-26': 9 },
          amanda: { '2017-01-23': 3, '2017-01-24': 5, '2017-01-25': 10, '2017-01-26': 13 },
          colin: { '2017-01-22': 7, '2017-01-24': 5, '2017-01-25': 11, '2017-01-26': 13, '2017-01-27': 13 },
          'lev-e2e-tests': { '2017-01-20': 3, '2017-01-21': 45, '2017-01-22': 12, '2017-01-23': 6, '2017-01-24': 30,
            '2017-01-25': 56, '2017-01-26': 62, '2017-01-27': 16 },
          norma: { '2017-01-25': 5 } };
        expect(expandUsers(records, dates)).to.deep.equal([
          { user: 'adam', searches: [null, null, 11, 12, 18, 6, 5, null, 52].map(wrapCount) },
          { user: 'amanda', searches: [null, null, null, 2, 3, 5, 7, null, 17].map(wrapCount) },
          { user: 'colin', searches: [null, null, 4, null, 3, 6, 7, 7, 27].map(wrapCount) },
          { user: 'lev-e2e-tests', searches: [2, 23, 6, 3, 15, 28, 31, 8, 116].map(wrapCount) },
          { user: 'norma', searches: [null, null, null, null, null, 3, null, null, 3].map(wrapCount) },
          { user: 'Day totals', searches: [2, 23, 21, 17, 39, 48, 50, 15, 215].map(wrapCount) }
        ]);
      });
    });

  });

});
