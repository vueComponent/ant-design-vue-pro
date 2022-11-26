var isArray = require('../type/is-array');
var each = require('../each');

/**
 * Flattens `array` a single level deep.
 *
 * @param {Array} arr The array to flatten.
 * @return {Array} Returns the new flattened array.
 * @example
 *
 * flatten([1, [2, [3, [4]], 5]]);  // => [1, 2, [3, [4]], 5]
 */
var flatten = function flatten(arr) {
  if (!isArray(arr)) {
    return arr;
  }
  var result = [];
  each(arr, function (item) {
    if (isArray(item)) {
      each(item, function (subItem) {
        result.push(subItem);
      });
    } else {
      result.push(item);
    }
  });
  return result;
};

module.exports = flatten;