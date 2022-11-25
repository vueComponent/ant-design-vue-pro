const toString = require('../to-string');

const upperCase = function(str) {
  return toString(str).toUpperCase();
};

module.exports = upperCase;
