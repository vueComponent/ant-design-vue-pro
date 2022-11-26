const each = require('../each');
const contains = require('./contains');

const uniq = function(arr) {
  const resultArr = [];
  each(arr, item => {
    if (!contains(resultArr, item)) {
      resultArr.push(item);
    }
  });
  return resultArr;
};

module.exports = uniq;
