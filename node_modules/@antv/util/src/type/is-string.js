const isType = require('./is-type');

const isString = function(str) {
  return isType(str, 'String');
};

module.exports = isString;
