const isString = require('../type/is-string');
const isFunction = require('../type/is-function');
const isArray = require('../type/is-array');

function sortBy(arr, key) {
  let comparer;
  if (isFunction(key)) {
    comparer = (a, b) => key(a) - key(b);
  } else {
    let keys = [];
    if (isString(key)) {
      keys.push(key);
    } else if (isArray(key)) {
      keys = key;
    }
    comparer = (a, b) => {
      for (let i = 0; i < keys.length; i += 1) {
        const prop = keys[i];
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
