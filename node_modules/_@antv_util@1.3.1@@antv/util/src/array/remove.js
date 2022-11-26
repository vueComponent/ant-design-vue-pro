const isArrayLike = require('../type/is-array-like');
const pullAt = require('./pull-at');

const remove = function(arr, predicate) {
  /**
   * const arr = [1, 2, 3, 4]
   * const evens = remove(arr, n => n % 2 == 0)
   * console.log(arr) // => [1, 3]
   * console.log(evens) // => [2, 4]
   */
  const result = [];
  if (!isArrayLike(arr)) {
    return result;
  }
  let i = -1;
  const indexes = [];
  const length = arr.length;

  while (++i < length) {
    const value = arr[i];
    if (predicate(value, i, arr)) {
      result.push(value);
      indexes.push(i);
    }
  }
  pullAt(arr, indexes);
  return result;
};

module.exports = remove;
