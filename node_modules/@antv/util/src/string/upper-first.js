const toString = require('../to-string');

const upperFirst = function(value) {
  const str = toString(value);
  return str.charAt(0).toUpperCase() + str.substring(1);
};

module.exports = upperFirst;
