var each = require('../each');
var isFunction = require('../type/is-function');

var keys = Object.keys ? function (obj) {
  return Object.keys(obj);
} : function (obj) {
  var result = [];
  each(obj, function (value, key) {
    if (!(isFunction(obj) && key === 'prototype')) {
      result.push(key);
    }
  });
  return result;
};

module.exports = keys;