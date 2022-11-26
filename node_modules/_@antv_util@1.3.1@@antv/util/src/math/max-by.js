const isArray = require('../type/is-array');
const isFunction = require('../type/is-function');
const each = require('../each');
/**
 * @param {Array} arr The array to iterate over.
 * @param {Function} [fn] The iteratee invoked per element.
 * @return {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * maxBy(objects, 'n');
 * // => { 'n': 2 }
 */
const maxBy = function(arr, fn) {
  if (!isArray(arr)) {
    return undefined;
  }
  let max = arr[0];
  let maxData;
  if (isFunction(fn)) {
    maxData = fn(arr[0]);
  } else {
    maxData = arr[0][fn];
  }
  let data;
  each(arr, val => {
    if (isFunction(fn)) {
      data = fn(val);
    } else {
      data = val[fn];
    }
    if (data > maxData) {
      max = val;
      maxData = data;
    }
  });
  return max;
};

module.exports = maxBy;
