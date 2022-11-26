const isArrayLike = require('../type/is-array-like');

const splice = Array.prototype.splice;

const pullAt = function pullAt(arr, indexes) {
  if (!isArrayLike(arr)) {
    return [];
  }
  let length = arr ? indexes.length : 0;
  const last = length - 1;

  while (length--) {
    let previous;
    const index = indexes[length];
    if (length === last || index !== previous) {
      previous = index;
      splice.call(arr, index, 1);
    }
  }
  return arr;
};

module.exports = pullAt;
