/*
 * @reference: https://github.com/jasondavies/science.js/blob/master/src/stats/kernel.js
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js#L16
 */
function uniform(u) {
  return Math.abs(u) <= 1 ? 0.5 : 0;
}

function tricubed(u) {
  var abs = 1 - Math.pow(Math.abs(u), 3);
  return Math.pow(abs, 3);
}

module.exports = {
  boxcar: uniform,
  cosine: function cosine(u) {
    if (Math.abs(u) <= 1) {
      return Math.PI / 4 * Math.cos(Math.PI / 2 * u);
    }

    return 0;
  },
  epanechnikov: function epanechnikov(u) {
    return Math.abs(u) < 1 ? 0.75 * (1 - u * u) : 0;
  },
  gaussian: function gaussian(u) {
    // return 1 / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * u * u);
    return 0.3989422804 * Math.exp(-0.5 * u * u);
  },
  quartic: function quartic(u) {
    if (Math.abs(u) < 1) {
      var tmp = 1 - u * u;
      return 15 / 16 * tmp * tmp;
    }

    return 0;
  },
  triangular: function triangular(u) {
    var abs = Math.abs(u);
    return abs < 1 ? 1 - abs : 0;
  },
  tricube: function tricube(u) {
    return Math.abs(u) < 1 ? 70 / 81 * tricubed(u) : 0;
  },
  triweight: function triweight(u) {
    if (Math.abs(u) < 1) {
      var tmp = 1 - u * u;
      return 35 / 32 * tmp * tmp * tmp;
    }

    return 0;
  },
  uniform: uniform
};