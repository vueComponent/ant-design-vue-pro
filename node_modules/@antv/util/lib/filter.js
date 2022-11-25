var each = require('./each');
var isArrayLike = require('./type/is-array-like');

var filter = function filter(arr, func) {
  if (!isArrayLike(arr)) {
    return arr;
  }
  var result = [];
  each(arr, function (value, index) {
    if (func(value, index)) {
      result.push(value);
    }
  });
  return result;
};

module.exports = filter;