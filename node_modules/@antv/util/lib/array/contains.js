var isArrayLike = require('../type/is-array-like');

var indexOf = Array.prototype.indexOf;

var contains = function contains(arr, value) {
  if (!isArrayLike(arr)) {
    return false;
  }
  return indexOf.call(arr, value) > -1;
};

module.exports = contains;