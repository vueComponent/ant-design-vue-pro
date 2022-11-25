var isObjectLike = require('./type/is-object-like');
var isArrayLike = require('./type/is-array-like');
var isString = require('./type/is-string');

var isEqual = function isEqual(value, other) {
  if (value === other) {
    return true;
  }
  if (!value || !other) {
    return false;
  }
  if (isString(value) || isString(other)) {
    return false;
  }
  if (isArrayLike(value) || isArrayLike(other)) {
    if (value.length !== other.length) {
      return false;
    }
    var rst = true;
    for (var i = 0; i < value.length; i++) {
      rst = isEqual(value[i], other[i]);
      if (!rst) {
        break;
      }
    }
    return rst;
  }
  if (isObjectLike(value) || isObjectLike(other)) {
    var valueKeys = Object.keys(value);
    var otherKeys = Object.keys(other);
    if (valueKeys.length !== otherKeys.length) {
      return false;
    }
    var _rst = true;
    for (var _i = 0; _i < valueKeys.length; _i++) {
      _rst = isEqual(value[valueKeys[_i]], other[valueKeys[_i]]);
      if (!_rst) {
        break;
      }
    }
    return _rst;
  }
  return false;
};

module.exports = isEqual;