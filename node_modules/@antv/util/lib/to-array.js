var isArrayLike = require('./type/is-array-like');

function toArray(value) {
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [];
}

module.exports = toArray;