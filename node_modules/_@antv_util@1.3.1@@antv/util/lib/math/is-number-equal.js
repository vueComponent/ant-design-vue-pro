var PRECISION = 0.00001; // numbers less than this is considered as 0

module.exports = function isNumberEqual(a, b) {
  var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PRECISION;

  return Math.abs(a - b) < precision;
};