const each = require('../each');

module.exports = function isEqual(obj1, obj2) {
  if (obj1.length !== obj2.length) {
    return false;
  }
  let result = true;
  each(obj1, (item, i) => {
    if (item !== obj2[i]) {
      result = false;
      return false;
    }
  });
  return result;
};
