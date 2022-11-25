var filter = require('../filter');
var contains = require('./contains');

/**
 * Flattens `array` a single level deep.
 *
 * @param {Array} arr The array to inspect.
 * @param {Array} values The values to exclude.
 * @return {Array} Returns the new array of filtered values.
 * @example
 * difference([2, 1], [2, 3]);  // => [1]
 */
var difference = function difference(arr) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return filter(arr, function (value) {
    return !contains(values, value);
  });
};

module.exports = difference;