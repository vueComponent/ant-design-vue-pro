var _require = require('simple-statistics'),
    standardDeviation = _require.standardDeviation,
    interquartileRange = _require.interquartileRange;

module.exports = {
  silverman: function silverman(arr) {
    var stdev = standardDeviation(arr);
    var num = 4 * Math.pow(stdev, 5);
    var denom = 3 * arr.length;
    return Math.pow(num / denom, 0.2);
  },
  nrd: function nrd(x) {
    var s = standardDeviation(x);
    var iqr = interquartileRange(x);

    if (typeof iqr === 'number') {
      s = Math.min(s, iqr / 1.34);
    }

    return 1.06 * s * Math.pow(x.length, -0.2);
  }
};