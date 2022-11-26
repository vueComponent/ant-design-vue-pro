/**
 * @fileOverview 分割数据用于处理存在 null 值的折线图、区域图
 * @author dxq613@gmail.com
 */
var Util = require('../../util');

var Global = require('../../global');

module.exports = {
  splitData: function splitData(data) {
    var viewTheme = this.get('viewTheme') || Global;
    if (!data.length) return [];
    var arr = [];
    var tmp = [];
    var yScale = this.getYScale();
    var yDim = yScale.field;
    var yValue;
    Util.each(data, function (obj) {
      yValue = obj._origin ? obj._origin[yDim] : obj[yDim];

      if (viewTheme.connectNulls) {
        // 如果忽视 Null 直接连接节点，则将 value = null 的数据过滤掉
        if (!Util.isNil(yValue)) {
          tmp.push(obj);
        }
      } else {
        if (Util.isArray(yValue) && Util.isNil(yValue[0]) || Util.isNil(yValue)) {
          if (tmp.length) {
            arr.push(tmp);
            tmp = [];
          }
        } else {
          tmp.push(obj);
        }
      }
    });

    if (tmp.length) {
      arr.push(tmp);
    }

    return arr;
  }
};