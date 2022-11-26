const DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

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
  const predictions = [];
  const observations = [];

  data.forEach((d, i) => {
    if (d[1] !== null) {
      observations.push(d);
      predictions.push(results[i]);
    }
  });

  const sum = observations.reduce((a, observation) => a + observation[1], 0);
  const mean = sum / observations.length;

  const ssyy = observations.reduce((a, observation) => {
    const difference = observation[1] - mean;
    return a + (difference * difference);
  }, 0);

  const sse = observations.reduce((accum, observation, index) => {
    const prediction = predictions[index];
    const residual = observation[1] - prediction[1];
    return accum + (residual * residual);
  }, 0);

  return 1 - (sse / ssyy);
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
  const matrix = input;
  const n = input.length - 1;
  const coefficients = [order];

  for (let i = 0; i < n; i++) {
    let maxrow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
        maxrow = j;
      }
    }

    for (let k = i; k < n + 1; k++) {
      const tmp = matrix[k][i];
      matrix[k][i] = matrix[k][maxrow];
      matrix[k][maxrow] = tmp;
    }

    for (let j = i + 1; j < n; j++) {
      for (let k = n; k >= i; k--) {
        matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
      }
    }
  }

  for (let j = n - 1; j >= 0; j--) {
    let total = 0;
    for (let k = j + 1; k < n; k++) {
      total += matrix[k][j] * coefficients[k];
    }

    coefficients[j] = (matrix[n][j] - total) / matrix[j][j];
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
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

/**
* The set of all fitting methods
*
* @namespace
*/
const methods = {
  linear(data, options) {
    const sum = [0, 0, 0, 0, 0];
    let len = 0;

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        len++;
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0];
        sum[3] += data[n][0] * data[n][1];
        sum[4] += data[n][1] * data[n][1];
      }
    }

    const run = ((len * sum[2]) - (sum[0] * sum[0]));
    const rise = ((len * sum[3]) - (sum[0] * sum[1]));
    const gradient = run === 0 ? 0 : round(rise / run, options.precision);
    const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), options.precision);

    const predict = x => ([
      round(x, options.precision),
      round((gradient * x) + intercept, options.precision)]
    );

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [gradient, intercept],
      r2: round(determinationCoefficient(data, points), options.precision),
      string: intercept === 0 ? `y = ${gradient}x` : `y = ${gradient}x + ${intercept}`,
    };
  },

  exponential(data, options) {
    const sum = [0, 0, 0, 0, 0, 0];

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0] * data[n][1];
        sum[3] += data[n][1] * Math.log(data[n][1]);
        sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
        sum[5] += data[n][0] * data[n][1];
      }
    }

    const denominator = ((sum[1] * sum[2]) - (sum[5] * sum[5]));
    const a = Math.exp(((sum[2] * sum[3]) - (sum[5] * sum[4])) / denominator);
    const b = ((sum[1] * sum[4]) - (sum[5] * sum[3])) / denominator;
    const coeffA = round(a, options.precision);
    const coeffB = round(b, options.precision);
    const predict = x => ([
      round(x, options.precision),
      round(coeffA * Math.exp(coeffB * x), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}e^(${coeffB}x)`,
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },

  logarithmic(data, options) {
    const sum = [0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += data[n][1] * Math.log(data[n][0]);
        sum[2] += data[n][1];
        sum[3] += (Math.log(data[n][0]) ** 2);
      }
    }

    const a = ((len * sum[1]) - (sum[2] * sum[0])) / ((len * sum[3]) - (sum[0] * sum[0]));
    const coeffB = round(a, options.precision);
    const coeffA = round((sum[2] - (coeffB * sum[0])) / len, options.precision);

    const predict = x => ([
      round(x, options.precision),
      round(round(coeffA + (coeffB * Math.log(x)), options.precision), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA} + ${coeffB} ln(x)`,
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },

  power(data, options) {
    const sum = [0, 0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
        sum[2] += Math.log(data[n][1]);
        sum[3] += (Math.log(data[n][0]) ** 2);
      }
    }

    const b = ((len * sum[1]) - (sum[0] * sum[2])) / ((len * sum[3]) - (sum[0] ** 2));
    const a = ((sum[2] - (b * sum[0])) / len);
    const coeffA = round(Math.exp(a), options.precision);
    const coeffB = round(b, options.precision);

    const predict = x => ([
      round(x, options.precision),
      round(round(coeffA * (x ** coeffB), options.precision), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}x^${coeffB}`,
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },

  polynomial(data, options) {
    const lhs = [];
    const rhs = [];
    let a = 0;
    let b = 0;
    const len = data.length;
    const k = options.order + 1;

    for (let i = 0; i < k; i++) {
      for (let l = 0; l < len; l++) {
        if (data[l][1] !== null) {
          a += (data[l][0] ** i) * data[l][1];
        }
      }

      lhs.push(a);
      a = 0;

      const c = [];
      for (let j = 0; j < k; j++) {
        for (let l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            b += data[l][0] ** (i + j);
          }
        }
        c.push(b);
        b = 0;
      }
      rhs.push(c);
    }
    rhs.push(lhs);

    const coefficients = gaussianElimination(rhs, k).map(v => round(v, options.precision));

    const predict = x => ([
      round(x, options.precision),
      round(
        coefficients.reduce((sum, coeff, power) => sum + (coeff * (x ** power)), 0),
        options.precision,
      ),
    ]);

    const points = data.map(point => predict(point[0]));

    let string = 'y = ';
    for (let i = coefficients.length - 1; i >= 0; i--) {
      if (i > 1) {
        string += `${coefficients[i]}x^${i} + `;
      } else if (i === 1) {
        string += `${coefficients[i]}x + `;
      } else {
        string += coefficients[i];
      }
    }

    return {
      string,
      points,
      predict,
      equation: [...coefficients].reverse(),
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },
};

function createWrapper() {
  const reduce = (accumulator, name) => ({
    _round: round,
    ...accumulator,
    [name](data, supplied) {
      return methods[name](data, {
        ...DEFAULT_OPTIONS,
        ...supplied,
      });
    },
  });

  return Object.keys(methods).reduce(reduce, {});
}

module.exports = createWrapper();
