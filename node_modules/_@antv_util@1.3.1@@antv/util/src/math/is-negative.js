const isNumber = require('../type/is-number');

const isNagative = function(num) {
  return isNumber(num) && num < 0;
};

module.exports = isNagative;
