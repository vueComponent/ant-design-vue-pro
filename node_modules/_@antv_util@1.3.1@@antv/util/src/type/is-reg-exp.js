const isType = require('./is-type');

const isRegExp = function(str) {
  return isType(str, 'RegExp');
};

module.exports = isRegExp;
