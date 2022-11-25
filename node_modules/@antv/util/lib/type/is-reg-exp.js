var isType = require('./is-type');

var isRegExp = function isRegExp(str) {
  return isType(str, 'RegExp');
};

module.exports = isRegExp;