var isFunction = require('../type/is-function');
var isPlainObject = require('../type/is-plain-object');
var isMatch = require('../object/is-match');

function find(arr, predicate) {
  var _predicate = void 0;
  if (isFunction(predicate)) {
    _predicate = predicate;
  }
  if (isPlainObject(predicate)) {
    _predicate = function _predicate(a) {
      return isMatch(a, predicate);
    };
  }
  if (_predicate) {
    for (var i = 0; i < arr.length; i += 1) {
      if (_predicate(arr[i])) {
        return arr[i];
      }
    }
  }
  return null;
}

module.exports = find;