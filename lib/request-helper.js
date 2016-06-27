'use strict';

const urlToObject = (requestArgs) => {
  return (requestArgs !== null && typeof requestArgs === 'object')
    ? requestArgs
    : {
      url: requestArgs
    };
}

module.exports = {
  urlToObject: urlToObject
};
