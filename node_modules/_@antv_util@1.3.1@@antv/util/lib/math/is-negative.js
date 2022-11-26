var isNumber = require('../type/is-number');

var isNagative = function isNagative(num) {
  return isNumber(num) && num < 0;
};

module.exports = isNagative;