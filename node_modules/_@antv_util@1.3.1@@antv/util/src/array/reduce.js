const isArray = require('../type/is-array');
const isPlainObject = require('../type/is-plain-object');
const each = require('../each');

const reduce = function(arr, fn, init) {
  if (!isArray(arr) && !isPlainObject(arr)) {
    return arr;
  }
  let result = init;
  each(arr, (data, i) => {
    result = fn(result, data, i);
  });
  return result;
};

module.exports = reduce;
