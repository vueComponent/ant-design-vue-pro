const toString = require('../to-string');

const lowerCase = function(str) {
  return toString(str).toLowerCase();
};

module.exports = lowerCase;
