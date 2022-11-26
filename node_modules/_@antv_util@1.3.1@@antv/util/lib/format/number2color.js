var numColorCache = {};

module.exports = function numberToColor(num) {
  // 增加缓存
  var color = numColorCache[num];
  if (!color) {
    var str = num.toString(16);
    for (var i = str.length; i < 6; i++) {
      str = '0' + str;
    }
    color = '#' + str;
    numColorCache[num] = color;
  }
  return color;
};