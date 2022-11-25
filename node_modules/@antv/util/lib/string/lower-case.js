var toString = require('../to-string');

var lowerCase = function lowerCase(str) {
  return toString(str).toLowerCase();
};

module.exports = lowerCase;