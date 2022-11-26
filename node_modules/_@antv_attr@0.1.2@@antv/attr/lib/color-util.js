/**
 * @fileOverview 颜色计算的辅助方法
 * @author dxq613@gmail.com
 */
var isNumber = require('@antv/util/lib/type/is-number');

var isString = require('@antv/util/lib/type/is-string');

var each = require('@antv/util/lib/each'); // const RGB_REG = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;


var RGB_REG = /rgba?\(([\s.,0-9]+)\)/; // 创建辅助 tag 取颜色

function createTmp() {
  var i = document.createElement('i');
  i.title = 'Web Colour Picker';
  i.style.display = 'none';
  document.body.appendChild(i);
  return i;
} // 获取颜色之间的插值


function getValue(start, end, percent, index) {
  var value = start[index] + (end[index] - start[index]) * percent;
  return value;
} // 数组转换成颜色


function arr2rgb(arr) {
  return '#' + toHex(arr[0]) + toHex(arr[1]) + toHex(arr[2]);
} // 将数值从 0-255 转换成16进制字符串


function toHex(value) {
  value = Math.round(value);
  value = value.toString(16);

  if (value.length === 1) {
    value = '0' + value;
  }

  return value;
}

function calColor(colors, percent) {
  if (isNaN(percent) || !isNumber(percent) || percent < 0) {
    percent = 0;
  }

  if (percent > 1) {
    percent = 1;
  }

  var steps = colors.length - 1;
  var step = Math.floor(steps * percent);
  var left = steps * percent - step;
  var start = colors[step];
  var end = step === steps ? start : colors[step + 1];
  var rgb = arr2rgb([getValue(start, end, left, 0), getValue(start, end, left, 1), getValue(start, end, left, 2)]);
  return rgb;
} // rgb 颜色转换成数组


function rgb2arr(str) {
  var arr = [];
  arr.push(parseInt(str.substr(1, 2), 16));
  arr.push(parseInt(str.substr(3, 2), 16));
  arr.push(parseInt(str.substr(5, 2), 16));
  return arr;
}

var colorCache = {};
var iEl = null;
var ColorUtil = {
  /**
   * 将颜色转换到 rgb 的格式
   * @param  {String} color 颜色
   * @return {String} 将颜色转换到 '#ffffff' 的格式
   */
  toRGB: function toRGB(color) {
    // 如果已经是 rgb的格式
    if (color[0] === '#' && color.length === 7) {
      return color;
    }

    if (!iEl) {
      // 防止防止在页头报错
      iEl = createTmp();
    }

    var rst;

    if (colorCache[color]) {
      rst = colorCache[color];
    } else {
      iEl.style.color = color;
      rst = document.defaultView.getComputedStyle(iEl, '').getPropertyValue('color');
      var matchs = RGB_REG.exec(rst);
      var cArray = matchs[1].split(/\s*,\s*/);
      rst = arr2rgb(cArray);
      colorCache[color] = rst;
    }

    return rst;
  },
  rgb2arr: rgb2arr,

  /**
   * 获取渐变函数
   * @param  {Array} colors 多个颜色
   * @return {String} 颜色值
   */
  gradient: function gradient(colors) {
    var points = [];

    if (isString(colors)) {
      colors = colors.split('-');
    }

    each(colors, function (color) {
      if (color.indexOf('#') === -1) {
        color = ColorUtil.toRGB(color);
      }

      points.push(rgb2arr(color));
    });
    return function (percent) {
      return calColor(points, percent);
    };
  }
};
module.exports = ColorUtil;