'use strict';

const moment = require('moment');
const Parent = require('../lib/hof-standalone');
const api = require('../api');
const validators = require('../lib/custom-validators');
const util = require('util');

validators.addValidators(Parent.validators);

const AuditController = function AuditController() {
  Parent.apply(this, arguments);
};

util.inherits(AuditController, Parent);

const dayGenerator = function* dayGenerator(from, to) { // eslint-disable-line generator-star-spacing
  while (from.isBefore(to)) {
    const day = from.format('D');
    yield {
      day: day,
      month: from.format('MMM'),
      year: from.format('YYYY'),
      classes: [
        from.format('dd')[0] === 'S' && 'weekend',
        day === '1' && 'first'
      ].filter(l => l).join(' '),
      date: from.format('YYYY-MM-DD')
    };
    from.add(1, 'days');
  }
};
const daysInDateRange = (from, to) => [...dayGenerator(moment(from), to)];

const addClasses = (src, trgt) => {
  if (src.classes && src.classes.length) {
    trgt.classes = src.classes;
  }
  return trgt;
};
const initDayTotals = days => days.map(day => addClasses(day, { count: 0 })).concat({ count: 0 });

const expandUsers = (records, days) => {
  const dayTotals = initDayTotals(days);

  const expandDays = searchCounts => {
    let total = 0;
    const searches = days.map((day, i) => {
      const date = day.date;
      const count = searchCounts[date] || 0;
      const usage = addClasses(day, { count: count || null });
      total += count;
      dayTotals[i].count += count;
      return usage;
    }).concat({ count: total });
    dayTotals[dayTotals.length - 1].count += total;
    return searches;
  };

  return Object.keys(records).map((user) => ({
    user: user,
    searches: expandDays(records[user])
  })).concat({
    user: 'Day totals',
    searches: dayTotals
  });
};

AuditController.prototype.successHandler = function successHandler(req, res, callback) {
  const username = req.headers['X-Auth-Username'] || req.headers['x-auth-username'];
  const from = validators.parseDate(req.form.values.from).floor(24, 'hours');
  const to = validators.parseDate(req.form.values.to).floor(24, 'hours');
  const toInclusive = moment(to).add(1, 'day');
  const userFilter = req.form.values.user;

  const resolved = (records) => {
    const data = {
      from: from.format('DD/MM/YYYY'),
      to: to.format('DD/MM/YYYY')
    };
    if (userFilter) {
      data.user = userFilter;
    }
    if (records && Object.keys(records).length) {
      const days = daysInDateRange(from, toInclusive);
      const usage = expandUsers(records, days);
      data.audit = {
        dates: days,
        usage: usage
      };
    } else {
      data.naudit = true;
    }
    res.render('pages/user-activity', data);
  };

  const rejected = (err) => {
    const error = (err instanceof Error) ? err : new Error(err);
    callback(error, req, res);
  };

  api.userActivityReport(username, from, toInclusive, userFilter).then(resolved, rejected);
};

const form = new AuditController({
  fields: require('../fields/audit'),
  template: 'pages/user-activity'
});

module.exports = form.requestHandler();
