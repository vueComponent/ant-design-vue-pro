const each = require('./each');
const isPlaineObject = require('./type/is-plain-object');

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 * pick(object, ['a', 'c']);  // => { 'a': 1, 'c': 3 }
 */

const pick = function(object, keys) {
  if (object === null || !isPlaineObject(object)) {
    return {};
  }
  const result = {};
  each(keys, key => {
    if (hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
  });
  return result;
};

module.exports = pick;
