const isObjectLike = require('./type/is-object-like');
const isArrayLike = require('./type/is-array-like');
const isString = require('./type/is-string');

const isEqual = function(value, other) {
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
    let rst = true;
    for (let i = 0; i < value.length; i++) {
      rst = isEqual(value[i], other[i]);
      if (!rst) {
        break;
      }
    }
    return rst;
  }
  if (isObjectLike(value) || isObjectLike(other)) {
    const valueKeys = Object.keys(value);
    const otherKeys = Object.keys(other);
    if (valueKeys.length !== otherKeys.length) {
      return false;
    }
    let rst = true;
    for (let i = 0; i < valueKeys.length; i++) {
      rst = isEqual(value[valueKeys[i]], other[valueKeys[i]]);
      if (!rst) {
        break;
      }
    }
    return rst;
  }
  return false;
};

module.exports = isEqual;
