const isArrayLike = require('../type/is-array-like');

const indexOf = Array.prototype.indexOf;

const contains = function(arr, value) {
  if (!isArrayLike(arr)) {
    return false;
  }
  return indexOf.call(arr, value) > -1;
};

module.exports = contains;
