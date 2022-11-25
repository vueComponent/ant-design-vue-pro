var isArray = require('@antv/util/lib/type/is-array');

var isFunction = require('@antv/util/lib/type/is-function');

var isString = require('@antv/util/lib/type/is-string');

module.exports = function (arr, keys) {
  if (keys === void 0) {
    keys = [];
  }

  var comparer;

  if (isFunction(keys)) {
    comparer = keys;
  } else if (isArray(keys)) {
    comparer = function comparer(a, b) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (a[key] < b[key]) {
          return -1;
        }

        if (a[key] > b[key]) {
          return 1;
        }
      }

      return 0;
    };
  } else if (isString(keys)) {
    comparer = function comparer(a, b) {
      if (a[keys] < b[keys]) {
        return -1;
      }

      if (a[keys] > b[keys]) {
        return 1;
      }

      return 0;
    };
  }

  return arr.sort(comparer);
};