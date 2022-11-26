const toString = {}.toString;

const getType = function(value) {
  return toString.call(value).replace(/^\[object /, '').replace(/\]$/, '');
};

module.exports = getType;
