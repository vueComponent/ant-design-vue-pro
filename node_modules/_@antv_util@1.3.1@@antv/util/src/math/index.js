const isNumberEqual = require('./is-number-equal');

module.exports = {
  clamp: require('./clamp'),
  fixedBase: require('./fixed-base'),
  isDecimal: require('./is-decimal'),
  isEven: require('./is-even'),
  isInteger: require('./is-integer'),
  isNegative: require('./is-negative'),
  isNumberEqual,
  isOdd: require('./is-odd'),
  isPositive: require('./is-positive'),
  maxBy: require('./max-by'),
  minBy: require('./min-by'),
  mod: require('./mod'),
  snapEqual: isNumberEqual,
  toDegree: require('./to-degree'),
  toInt: require('./to-integer'),
  toInteger: require('./to-integer'),
  toRadian: require('./to-radian')
};
