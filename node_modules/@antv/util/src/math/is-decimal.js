const isNumber = require('../type/is-number');

const isDecimal = function(num) {
  return isNumber(num) && num % 1 !== 0;
};

module.exports = isDecimal;
