var isArrayLike = require('../type/is-array-like');
var pullAt = require('./pull-at');

var remove = function remove(arr, predicate) {
  /**
   * const arr = [1, 2, 3, 4]
   * const evens = remove(arr, n => n % 2 == 0)
   * console.log(arr) // => [1, 3]
   * console.log(evens) // => [2, 4]
   */
  var result = [];
  if (!isArrayLike(arr)) {
    return result;
  }
  var i = -1;
  var indexes = [];
  var length = arr.length;

  while (++i < length) {
    var value = arr[i];
    if (predicate(value, i, arr)) {
      result.push(value);
      indexes.push(i);
    }
  }
  pullAt(arr, indexes);
  return result;
};

module.exports = remove;