var toString = require('../to-string');

var upperCase = function upperCase(str) {
  return toString(str).toUpperCase();
};

module.exports = upperCase;