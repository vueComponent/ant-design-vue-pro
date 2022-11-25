var isArray = require('../type/is-array');
var isFunction = require('../type/is-function');
var each = require('../each');
/**
 * @param {Array} arr The array to iterate over.
 * @param {Function} [fn] The iteratee invoked per element.
 * @return {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * minBy(objects, 'n');
 * // => { 'n': 1 }
 */
var minBy = function minBy(arr, fn) {
  if (!isArray(arr)) {
    return undefined;
  }
  var min = arr[0];
  var minData = void 0;
  if (isFunction(fn)) {
    minData = fn(arr[0]);
  } else {
    minData = arr[0][fn];
  }
  var data = void 0;
  each(arr, function (val) {
    if (isFunction(fn)) {
      data = fn(val);
    } else {
      data = val[fn];
    }
    if (data < minData) {
      min = val;
      minData = data;
    }
  });
  return min;
};

module.exports = minBy;