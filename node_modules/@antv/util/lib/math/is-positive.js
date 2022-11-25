var isNumber = require('../type/is-number');

var isPositive = function isPositive(num) {
  return isNumber(num) && num > 0;
};

module.exports = isPositive;