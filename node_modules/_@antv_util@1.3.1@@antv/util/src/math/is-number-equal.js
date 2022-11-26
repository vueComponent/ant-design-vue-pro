const PRECISION = 0.00001; // numbers less than this is considered as 0

module.exports = function isNumberEqual(a, b, precision = PRECISION) {
  return Math.abs((a - b)) < precision;
};
