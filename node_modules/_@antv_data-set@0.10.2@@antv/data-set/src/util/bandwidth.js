const {
  standardDeviation,
  interquartileRange
} = require('simple-statistics');

module.exports = {
  silverman(arr) {
    const stdev = standardDeviation(arr);
    const num = 4 * Math.pow(stdev, 5);
    const denom = 3 * arr.length;
    return Math.pow(num / denom, 0.2);
  },

  nrd(x) {
    let s = standardDeviation(x);
    const iqr = interquartileRange(x);
    if (typeof iqr === 'number') {
      s = Math.min(s, iqr / 1.34);
    }
    return 1.06 * s * Math.pow(x.length, -0.2);
  }
};
