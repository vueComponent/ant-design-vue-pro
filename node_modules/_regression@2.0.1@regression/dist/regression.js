(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.regression = mod.exports;
  }
})(this, function (module) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} data - Pairs of observed x-y values
  * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(data, results) {
    var predictions = [];
    var observations = [];

    data.forEach(function (d, i) {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

    var sum = observations.reduce(function (a, observation) {
      return a + observation[1];
    }, 0);
    var mean = sum / observations.length;

    var ssyy = observations.reduce(function (a, observation) {
      var difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    var sse = observations.reduce(function (accum, observation, index) {
      var prediction = predictions[index];
      var residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }

  /**
  * Determine the solution of a system of linear equations A * x = b using
  * Gaussian elimination.
  *
  * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
  * @param {number} order - How many degrees to solve for
  *
  * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
  */
  function gaussianElimination(input, order) {
    var matrix = input;
    var n = input.length - 1;
    var coefficients = [order];

    for (var i = 0; i < n; i++) {
      var maxrow = i;
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (var _j = i + 1; _j < n; _j++) {
        for (var _k = n; _k >= i; _k--) {
          matrix[_k][_j] -= matrix[_k][i] * matrix[i][_j] / matrix[i][i];
        }
      }
    }

    for (var _j2 = n - 1; _j2 >= 0; _j2--) {
      var total = 0;
      for (var _k2 = _j2 + 1; _k2 < n; _k2++) {
        total += matrix[_k2][_j2] * coefficients[_k2];
      }

      coefficients[_j2] = (matrix[n][_j2] - total) / matrix[_j2][_j2];
    }

    return coefficients;
  }

  /**
  * Round a number to a precision, specificed in number of decimal places
  *
  * @param {number} number - The number to round
  * @param {number} precision - The number of decimal places to round to:
  *                             > 0 means decimals, < 0 means powers of 10
  *
  *
  * @return {numbr} - The number, rounded
  */
  function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = 0;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      var run = len * sum[2] - sum[0] * sum[0];
      var rise = len * sum[3] - sum[0] * sum[1];
      var gradient = run === 0 ? 0 : round(rise / run, options.precision);
      var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? 'y = ' + gradient + 'x' : 'y = ' + gradient + 'x + ' + intercept
      };
    },
    exponential: function exponential(data, options) {
      var sum = [0, 0, 0, 0, 0, 0];

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0] * data[n][1];
          sum[3] += data[n][1] * Math.log(data[n][1]);
          sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
          sum[5] += data[n][0] * data[n][1];
        }
      }

      var denominator = sum[1] * sum[2] - sum[5] * sum[5];
      var a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      var b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
      var coeffA = round(a, options.precision);
      var coeffB = round(b, options.precision);
      var predict = function predict(x) {
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    logarithmic: function logarithmic(data, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA + coeffB * Math.log(x), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    power: function power(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - Math.pow(sum[0], 2));
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA * Math.pow(x, coeffB), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    polynomial: function polynomial(data, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var len = data.length;
      var k = options.order + 1;

      for (var i = 0; i < k; i++) {
        for (var l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        var c = [];
        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < len; _l++) {
            if (data[_l][1] !== null) {
              b += Math.pow(data[_l][0], i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k).map(function (v) {
        return round(v, options.precision);
      });

      var predict = function predict(x) {
        return [round(x, options.precision), round(coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      var string = 'y = ';
      for (var _i = coefficients.length - 1; _i >= 0; _i--) {
        if (_i > 1) {
          string += coefficients[_i] + 'x^' + _i + ' + ';
        } else if (_i === 1) {
          string += coefficients[_i] + 'x + ';
        } else {
          string += coefficients[_i];
        }
      }

      return {
        string: string,
        points: points,
        predict: predict,
        equation: [].concat(_toConsumableArray(coefficients)).reverse(),
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    }
  };

  function createWrapper() {
    var reduce = function reduce(accumulator, name) {
      return _extends({
        _round: round
      }, accumulator, _defineProperty({}, name, function (data, supplied) {
        return methods[name](data, _extends({}, DEFAULT_OPTIONS, supplied));
      }));
    };

    return Object.keys(methods).reduce(reduce, {});
  }

  module.exports = createWrapper();
});
