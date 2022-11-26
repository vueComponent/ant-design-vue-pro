var isNumber = require('../type/is-number');

var isEven = function isEven(num) {
  return isNumber(num) && num % 2 === 0;
};

module.exports = isEven;