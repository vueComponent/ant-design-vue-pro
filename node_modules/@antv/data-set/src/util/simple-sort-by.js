const isArray = require('@antv/util/lib/type/is-array');
const isFunction = require('@antv/util/lib/type/is-function');
const isString = require('@antv/util/lib/type/is-string');

module.exports = (arr, keys = []) => {
  let comparer;
  if (isFunction(keys)) {
    comparer = keys;
  } else if (isArray(keys)) {
    comparer = (a, b) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
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
    comparer = (a, b) => {
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
