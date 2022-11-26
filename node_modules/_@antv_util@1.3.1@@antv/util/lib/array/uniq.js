var each = require('../each');
var contains = require('./contains');

var uniq = function uniq(arr) {
  var resultArr = [];
  each(arr, function (item) {
    if (!contains(resultArr, item)) {
      resultArr.push(item);
    }
  });
  return resultArr;
};

module.exports = uniq;