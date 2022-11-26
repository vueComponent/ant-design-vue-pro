const isNumber = require('../type/is-number');

const isEven = function(num) {
  return isNumber(num) && num % 2 === 0;
};

module.exports = isEven;
