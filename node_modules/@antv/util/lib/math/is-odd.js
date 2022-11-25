var isNumber = require('../type/is-number');

var isOdd = function isOdd(num) {
  return isNumber(num) && num % 2 !== 0;
};

module.exports = isOdd;