var isArray = require('../type/is-array');
var isFunction = require('../type/is-function');
var each = require('../each');
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
var maxBy = function maxBy(arr, fn) {
  if (!isArray(arr)) {
    return undefined;
  }
  var max = arr[0];
  var maxData = void 0;
  if (isFunction(fn)) {
    maxData = fn(arr[0]);
  } else {
    maxData = arr[0][fn];
  }
  var data = void 0;
  each(arr, function (val) {
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