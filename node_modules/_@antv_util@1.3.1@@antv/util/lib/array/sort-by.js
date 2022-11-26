var isString = require('../type/is-string');
var isFunction = require('../type/is-function');
var isArray = require('../type/is-array');

function sortBy(arr, key) {
  var comparer = void 0;
  if (isFunction(key)) {
    comparer = function comparer(a, b) {
      return key(a) - key(b);
    };
  } else {
    var keys = [];
    if (isString(key)) {
      keys.push(key);
    } else if (isArray(key)) {
      keys = key;
    }
    comparer = function comparer(a, b) {
      for (var i = 0; i < keys.length; i += 1) {
        var prop = keys[i];
        if (a[prop] > b[prop]) {
          return 1;
        }
        if (a[prop] < b[prop]) {
          return -1;
        }
      }
      return 0;
    };
  }

  arr.sort(comparer);
  return arr;
}

module.exports = sortBy;