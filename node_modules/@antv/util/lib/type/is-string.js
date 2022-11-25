var isType = require('./is-type');

var isString = function isString(str) {
  return isType(str, 'String');
};

module.exports = isString;