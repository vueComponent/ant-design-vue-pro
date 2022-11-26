const keys = require('./keys');
const isNil = require('../type/is-nil');

function isMatch(obj, attrs) {
  const _keys = keys(attrs);
  const length = _keys.length;
  if (isNil(obj)) return !length;
  for (let i = 0; i < length; i += 1) {
    const key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) {
      return false;
    }
  }
  return true;
}

module.exports = isMatch;
