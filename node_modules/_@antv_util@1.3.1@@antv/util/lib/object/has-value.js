var contains = require('../array/contains');
var values = require('./values');

module.exports = function (obj, value) {
  return contains(values(obj), value);
};