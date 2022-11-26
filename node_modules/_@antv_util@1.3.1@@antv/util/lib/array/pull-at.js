var isArrayLike = require('../type/is-array-like');

var splice = Array.prototype.splice;

var pullAt = function pullAt(arr, indexes) {
  if (!isArrayLike(arr)) {
    return [];
  }
  var length = arr ? indexes.length : 0;
  var last = length - 1;

  while (length--) {
    var previous = void 0;
    var index = indexes[length];
    if (length === last || index !== previous) {
      previous = index;
      splice.call(arr, index, 1);
    }
  }
  return arr;
};

module.exports = pullAt;