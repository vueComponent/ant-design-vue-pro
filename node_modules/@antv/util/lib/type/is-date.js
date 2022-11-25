var isType = require('./is-type');

var isDate = function isDate(value) {
  return isType(value, 'Date');
};

module.exports = isDate;