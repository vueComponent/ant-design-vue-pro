var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray = require('./type/is-array');

var clone = function clone(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) {
    return obj;
  }
  var rst = void 0;
  if (isArray(obj)) {
    rst = [];
    for (var i = 0, l = obj.length; i < l; i++) {
      if (_typeof(obj[i]) === 'object' && obj[i] != null) {
        rst[i] = clone(obj[i]);
      } else {
        rst[i] = obj[i];
      }
    }
  } else {
    rst = {};
    for (var k in obj) {
      if (_typeof(obj[k]) === 'object' && obj[k] != null) {
        rst[k] = clone(obj[k]);
      } else {
        rst[k] = obj[k];
      }
    }
  }

  return rst;
};

module.exports = clone;