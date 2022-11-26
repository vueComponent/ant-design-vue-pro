const isNil = require('./type/is-nil');

function toString(value) {
  if (isNil(value)) return '';
  return value.toString();
}

module.exports = toString;
