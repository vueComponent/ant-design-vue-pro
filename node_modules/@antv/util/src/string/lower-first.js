const toString = require('../to-string');

const lowerFirst = function(value) {
  const str = toString(value);
  return str.charAt(0).toLowerCase() + str.substring(1);
};

module.exports = lowerFirst;
