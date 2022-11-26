var each = require('../each');
var isFunction = require('../type/is-function');

var values = Object.values ? function (obj) {
  return Object.values(obj);
} : function (obj) {
  var result = [];
  each(obj, function (value, key) {
    if (!(isFunction(obj) && key === 'prototype')) {
      result.push(value);
    }
  });
  return result;
};

module.exports = values;