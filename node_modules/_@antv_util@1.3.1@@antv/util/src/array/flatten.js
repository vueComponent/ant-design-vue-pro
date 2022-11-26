const isArray = require('../type/is-array');
const each = require('../each');

/**
 * Flattens `array` a single level deep.
 *
 * @param {Array} arr The array to flatten.
 * @return {Array} Returns the new flattened array.
 * @example
 *
 * flatten([1, [2, [3, [4]], 5]]);  // => [1, 2, [3, [4]], 5]
 */
const flatten = function(arr) {
  if (!isArray(arr)) {
    return arr;
  }
  const result = [];
  each(arr, item => {
    if (isArray(item)) {
      each(item, subItem => {
        result.push(subItem);
      });
    } else {
      result.push(item);
    }
  });
  return result;
};

module.exports = flatten;
