const isNumber = require('../type/is-number');

const isOdd = function(num) {
  return isNumber(num) && num % 2 !== 0;
};

module.exports = isOdd;
