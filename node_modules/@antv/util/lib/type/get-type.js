var toString = {}.toString;

var getType = function getType(value) {
  return toString.call(value).replace(/^\[object /, '').replace(/\]$/, '');
};

module.exports = getType;