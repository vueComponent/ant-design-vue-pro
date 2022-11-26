const isType = require('./is-type');

const isDate = function(value) {
  return isType(value, 'Date');
};

module.exports = isDate;
