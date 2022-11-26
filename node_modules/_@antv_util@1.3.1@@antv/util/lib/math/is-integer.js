var isNumber = require('../type/is-number');

var isInteger = Number.isInteger ? Number.isInteger : function (num) {
  return isNumber(num) && num % 1 === 0;
};

module.exports = isInteger;