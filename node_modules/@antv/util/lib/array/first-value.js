var isNil = require('../type/is-nil');
var isArray = require('../type/is-array');

var firstValue = function firstValue(data, name) {
  var rst = null;
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var value = obj[name];
    if (!isNil(value)) {
      if (isArray(value)) {
        rst = value[0];
      } else {
        rst = value;
      }
      break;
    }
  }
  return rst;
};

module.exports = firstValue;