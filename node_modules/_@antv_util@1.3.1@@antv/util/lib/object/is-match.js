var keys = require('./keys');
var isNil = require('../type/is-nil');

function isMatch(obj, attrs) {
  var _keys = keys(attrs);
  var length = _keys.length;
  if (isNil(obj)) return !length;
  for (var i = 0; i < length; i += 1) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) {
      return false;
    }
  }
  return true;
}

module.exports = isMatch;