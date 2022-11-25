var merge = function merge(dataArray) {
  var rst = [];
  for (var i = 0; i < dataArray.length; i++) {
    rst = rst.concat(dataArray[i]);
  }
  return rst;
};

module.exports = merge;