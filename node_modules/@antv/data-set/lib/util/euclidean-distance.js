/*
 * @reference: https://github.com/zeke/euclidean-distance
 */
module.exports = function (a, b) {
  var sum = 0;
  var n;

  for (n = 0; n < a.length; n++) {
    sum += Math.pow(a[n] - b[n], 2);
  }

  return Math.sqrt(sum);
};