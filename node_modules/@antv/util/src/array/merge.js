const merge = function(dataArray) {
  let rst = [];
  for (let i = 0; i < dataArray.length; i++) {
    rst = rst.concat(dataArray[i]);
  }
  return rst;
};

module.exports = merge;
