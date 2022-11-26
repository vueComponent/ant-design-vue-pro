var isNil = require('../type/is-nil');
var isArray = require('../type/is-array');
var each = require('../each');

module.exports = function valuesOfKey(data, name) {
  var rst = [];
  var tmpMap = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var value = obj[name];
    if (!isNil(value)) {
      if (!isArray(value)) {
        value = [value];
      }
      each(value, function (val) {
        if (!tmpMap[val]) {
          rst.push(val);
          tmpMap[val] = true;
        }
      });
    }
  }
  return rst;
};