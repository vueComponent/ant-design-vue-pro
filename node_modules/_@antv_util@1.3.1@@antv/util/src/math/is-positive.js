const isNumber = require('../type/is-number');

const isPositive = function(num) {
  return isNumber(num) && num > 0;
};

module.exports = isPositive;
