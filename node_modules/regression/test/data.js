export const linear = {

  zeroGradient: {
    r2: NaN,
    equation: [0, 10],
    predicted: [10, 10],
    string: 'y = 0x + 10',
    data: [[10, 10], [10, 10], [10, 10]],
    points: [[10, 10], [10, 10], [10, 10]],
  },

  zeroIntercept: {
    r2: 1,
    equation: [2, 0],
    string: 'y = 2x',
    predicted: [10, 20],
    data: [[0, 0], [1, 2], [2, 4], [3, 6]],
    points: [[0, 0], [1, 2], [2, 4], [3, 6]],
  },

  positiveGradient: {
    r2: 1,
    equation: [2, 1],
    predicted: [20, 41],
    string: 'y = 2x + 1',
    data: [[10, 21], [100, 201], [1000, 2001], [10000, 20001]],
    points: [[10, 21], [100, 201], [1000, 2001], [10000, 20001]],
  },

  negativeGradient: {
    r2: 1,
    predicted: [3, -7],
    equation: [-2, -1],
    string: 'y = -2x + -1',
    data: [[10, -21], [100, -201], [1000, -2001], [10000, -20001]],
    points: [[10, -21], [100, -201], [1000, -2001], [10000, -20001]],
  },

  positiveGradientWithEmpty: {
    r2: 1,
    equation: [2, 1],
    predicted: [20, 41],
    string: 'y = 2x + 1',
    data: [[10, 21], [100, null], [1000, 2001], [10000, null]],
    points: [[10, 21], [100, 201], [1000, 2001], [10000, 20001]],
  },

};

export const exponential = {

  growthGreaterThanZero: {
    r2: 1,
    equation: [2, 2],
    predicted: [2, 109.2],
    string: 'y = 2e^(2x)',
    points: [[0, 2], [0.69, 8], [1.1, 18], [1.39, 32]],
    data: [[0, 2], [0.6931471806, 8], [1.098612289, 18], [1.386294361, 32]],
  },

  decayGreaterThanZero: {
    r2: 1,
    equation: [2, -2],
    predicted: [2, 0.04],
    string: 'y = 2e^(-2x)',
    points: [[0, 2], [0.69, 0.5], [1.1, 0.22], [1.39, 0.13]],
    data: [[0, 2], [0.6931471806, 0.5], [1.098612289, 0.2222222222], [1.386294361, 0.125]],
  },

  growthGreaterThanZeroWithEmpty: {
    r2: 1,
    equation: [2, 2],
    predicted: [2, 109.2],
    string: 'y = 2e^(2x)',
    points: [[0, 2], [0.69, 8], [1.1, 18], [1.39, 32]],
    data: [[0, 2], [0.6931471806, null], [1.098612289, 18], [1.386294361, null]],
  },
};

export const logarithmic = {
  greaterThanOne: {
    r2: 1,
    equation: [0, 10],
    predicted: [5, 16.09],
    string: 'y = 0 + 10 ln(x)',
    points: [[1, 0], [2, 6.93], [3, 10.99], [4, 13.86]],
    data: [[1, 0], [2, 6.931471806], [3, 10.98612289], [4, 13.86294361]],
  },

  greaterThanOneWithEmpty: {
    r2: 1,
    equation: [0, 10],
    predicted: [5, 16.09],
    string: 'y = 0 + 10 ln(x)',
    points: [[1, 0], [2, 6.93], [3, 10.99], [4, 13.86]],
    data: [[1, 0], [2, null], [3, 10.98612289], [4, null]],
  },
};

export const power = {
  coefficientsEqualToOne: {
    r2: 1,
    equation: [1, 1],
    predicted: [7, 7],
    string: 'y = 1x^1',
    points: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
    data: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
  },

  coefficientsEqualToOneWithEmpty: {
    r2: 1,
    equation: [1, 1],
    predicted: [7, 7],
    string: 'y = 1x^1',
    points: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
    data: [[1, 1], [2, null], [3, 3], [4, 4], [5, 5], [6, null]],
  },
};

export const polynomial = {

  positiveLinearGradient: {
    config: { order: 1 },
    r2: 1,
    equation: [2, 0],
    string: 'y = 2x + 0',
    predicted: [4, 8],
    data: [[10, 20], [100, 200], [1000, 2000], [10000, 20000]],
    points: [[10, 20], [100, 200], [1000, 2000], [10000, 20000]],
  },

  negativeLinearGradient: {
    config: { order: 1 },
    r2: 1,
    equation: [-2, 0],
    string: 'y = -2x + 0',
    predicted: [4, -8],
    data: [[10, -20], [100, -200], [1000, -2000], [10000, -20000]],
    points: [[10, -20], [100, -200], [1000, -2000], [10000, -20000]],
  },

  parabolaPositiveCoefficients: {
    config: { order: 2 },
    r2: 1,
    equation: [1, 2, 3],
    predicted: [4, 27],
    string: 'y = 1x^2 + 2x + 3',
    data: [[0, 3], [1, 6], [2, 11], [3, 18]],
    points: [[0, 3], [1, 6], [2, 11], [3, 18]],
  },

  parabolaNegativeCoefficients: {
    config: { order: 2 },
    r2: 1,
    equation: [-1, -2, -3],
    predicted: [4, -27],
    string: 'y = -1x^2 + -2x + -3',
    data: [[0, -3], [1, -6], [2, -11], [3, -18]],
    points: [[0, -3], [1, -6], [2, -11], [3, -18]],
  },

  cubicPositiveCoefficients: {
    config: { order: 3 },
    r2: 1,
    equation: [2, 2, 2, 2],
    predicted: [4, 170],
    string: 'y = 2x^3 + 2x^2 + 2x + 2',
    data: [[0, 2], [1, 8], [2, 30], [3, 80]],
    points: [[0, 2], [1, 8], [2, 30], [3, 80]],
  },

  cubicNegativeCoefficients: {
    config: { order: 3 },
    r2: 1,
    equation: [-2, -2, -2, -2],
    predicted: [4, -170],
    string: 'y = -2x^3 + -2x^2 + -2x + -2',
    data: [[0, -2], [1, -8], [2, -30], [3, -80]],
    points: [[0, -2], [1, -8], [2, -30], [3, -80]],
  },

  cubicPositiveCoefficientsWithEmpty: {
    config: { order: 3 },
    r2: 1,
    equation: [2, 2, 2, 2],
    predicted: [4, 170],
    string: 'y = 2x^3 + 2x^2 + 2x + 2',
    data: [[0, 2], [1, null], [2, 30], [3, 80], [4, 170], [5, 312]],
    points: [[0, 2], [1, 8], [2, 30], [3, 80], [4, 170], [5, 312]],
  },

  zeroYValueCubic: {
    r2: 1,
    config: { order: 3 },
    equation: [1, 2, 3, -6],
    predicted: [7, 456],
    string: 'y = 1x^3 + 2x^2 + 3x + -6',
    data: [[1, 0], [2, 16], [3, 48], [4, 102], [5, 184], [6, 300]],
    points: [[1, 0], [2, 16], [3, 48], [4, 102], [5, 184], [6, 300]],
  },

  zeroYCoefficientCubic: {
    r2: 1,
    config: { order: 3 },
    equation: [0, 1, 2, 3],
    predicted: [7, 66],
    string: 'y = 0x^3 + 1x^2 + 2x + 3',
    data: [[1, 6], [2, 11], [3, 18], [4, 27], [5, 38], [6, 51]],
    points: [[1, 6], [2, 11], [3, 18], [4, 27], [5, 38], [6, 51]],
  },

};
