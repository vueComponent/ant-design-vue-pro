const filter = require('../filter');
const contains = require('./contains');

/**
 * Flattens `array` a single level deep.
 *
 * @param {Array} arr The array to inspect.
 * @param {Array} values The values to exclude.
 * @return {Array} Returns the new array of filtered values.
 * @example
 * difference([2, 1], [2, 3]);  // => [1]
 */
const difference = function(arr, values = []) {
  return filter(arr, value => !contains(values, value));
};

module.exports = difference;
