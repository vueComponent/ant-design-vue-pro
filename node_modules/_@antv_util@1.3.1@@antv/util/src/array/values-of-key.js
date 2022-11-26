const isNil = require('../type/is-nil');
const isArray = require('../type/is-array');
const each = require('../each');

module.exports = function valuesOfKey(data, name) {
  const rst = [];
  const tmpMap = {};
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    let value = obj[name];
    if (!isNil(value)) {
      if (!isArray(value)) {
        value = [ value ];
      }
      each(value, val => {
        if (!tmpMap[val]) {
          rst.push(val);
          tmpMap[val] = true;
        }
      });
    }
  }
  return rst;
};
