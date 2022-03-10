'use strict';

const search = {
  forenames: 'Winston',
  surname: 'Churchil',
  dobd: '30/11/2011'
};

const result = `No records found for ${search.forenames} ${search.surname} ${search.dobd}`;

module.exports = {
  search,
  result
};
