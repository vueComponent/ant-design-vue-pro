/**
 * @fileOverview 计算方法
 * @author dxq613@gmail.com
 */
// 如果小数点后面超过 10 位浮点数时进行一下处理
var DECIMAL_LENGTH = 12; // 获取系数

function getFactor(v) {
  var factor = 1;

  if (v === Infinity || v === -Infinity) {
    throw new Error('Not support Infinity!');
  }

  if (v < 1) {
    var count = 0;

    while (v < 1) {
      factor = factor / 10;
      v = v * 10;
      count++;
    } // 浮点数计算出现问题


    if (factor.toString().length > DECIMAL_LENGTH) {
      factor = parseFloat(factor.toFixed(count));
    }
  } else {
    while (v > 10) {
      factor = factor * 10;
      v = v / 10;
    }
  }

  return factor;
} // 取小于当前值的


function arrayFloor(values, value) {
  var length = values.length;

  if (length === 0) {
    return NaN;
  }

  var pre = values[0];

  if (value < values[0]) {
    return NaN;
  }

  if (value >= values[length - 1]) {
    return values[length - 1];
  }

  for (var i = 1; i < values.length; i++) {
    if (value < values[i]) {
      break;
    }

    pre = values[i];
  }

  return pre;
} // 大于当前值的第一个


function arrayCeiling(values, value) {
  var length = values.length;

  if (length === 0) {
    return NaN;
  } // var pre = values[0];


  var rst;

  if (value > values[length - 1]) {
    return NaN;
  }

  if (value < values[0]) {
    return values[0];
  }

  for (var i = 1; i < values.length; i++) {
    if (value <= values[i]) {
      rst = values[i];
      break;
    }
  }

  return rst;
}

var Util = {
  // 获取逼近的数值
  snapFactorTo: function snapFactorTo(v, arr, snapType) {
    // 假设 v = -512,isFloor = true
    if (isNaN(v)) {
      return NaN;
    }

    var factor = 1; // 计算系数

    if (v !== 0) {
      if (v < 0) {
        factor = -1;
      }

      v = v * factor; // v = 512

      var tmpFactor = getFactor(v);
      factor = factor * tmpFactor; // factor = -100

      v = v / tmpFactor; // v = 5.12
    }

    if (snapType === 'floor') {
      v = Util.snapFloor(arr, v); // v = 5
    } else if (snapType === 'ceil') {
      v = Util.snapCeiling(arr, v); // v = 6
    } else {
      v = Util.snapTo(arr, v); // 四舍五入 5
    }

    var rst = parseFloat((v * factor).toPrecision(DECIMAL_LENGTH)); // 如果出现浮点数计算问题，需要处理一下
    // 如果出现浮点数计算问题，需要处理一下

    if (Math.abs(factor) < 1 && rst.toString().length > DECIMAL_LENGTH) {
      var decimalVal = parseInt(1 / factor);
      var symbol = factor > 0 ? 1 : -1;
      rst = v / decimalVal * symbol;
    }

    return rst;
  },
  // 获取逼近的倍数
  snapMultiple: function snapMultiple(v, base, snapType) {
    var div;

    if (snapType === 'ceil') {
      div = Math.ceil(v / base);
    } else if (snapType === 'floor') {
      div = Math.floor(v / base);
    } else {
      div = Math.round(v / base);
    }

    return div * base;
  },

  /**
   * 获取逼近的值，用于对齐数据
   * @param  {Array} values   数据集合
   * @param  {Number} value   数值
   * @return {Number} 逼近的值
   */
  snapTo: function snapTo(values, value) {
    // 这里假定values是升序排列
    var floorVal = arrayFloor(values, value);
    var ceilingVal = arrayCeiling(values, value);

    if (isNaN(floorVal) || isNaN(ceilingVal)) {
      if (values[0] >= value) {
        return values[0];
      }

      var last = values[values.length - 1];

      if (last <= value) {
        return last;
      }
    }

    if (Math.abs(value - floorVal) < Math.abs(ceilingVal - value)) {
      return floorVal;
    }

    return ceilingVal;
  },

  /**
   * 获取逼近的最小值，用于对齐数据
   * @param  {Array} values   数据集合
   * @param  {Number} value   数值
   * @return {Number} 逼近的最小值
   */
  snapFloor: function snapFloor(values, value) {
    // 这里假定values是升序排列
    return arrayFloor(values, value);
  },

  /**
   * 获取逼近的最大值，用于对齐数据
   * @param  {Array} values   数据集合
   * @param  {Number} value   数值
   * @return {Number} 逼近的最大值
   */
  snapCeiling: function snapCeiling(values, value) {
    // 这里假定values是升序排列
    return arrayCeiling(values, value);
  },
  fixedBase: function fixedBase(v, base) {
    var str = base.toString();
    var index = str.indexOf('.');
    var indexOfExp = str.indexOf('e-'); // 判断是否带小数点，1.000001 1.23e-9

    if (index < 0 && indexOfExp < 0) {
      // base为整数
      return Math.round(v);
    }

    var length = indexOfExp >= 0 ? parseInt(str.substr(indexOfExp + 2), 10) : str.substr(index + 1).length;

    if (length > 20) {
      length = 20;
    }

    return parseFloat(v.toFixed(length));
  }
};
module.exports = Util;