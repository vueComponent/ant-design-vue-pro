function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var each = require('@antv/util/lib/each');

var maxBy = require('@antv/util/lib/math/max-by');

var isArray = require('@antv/util/lib/type/is-array');

var ArrayUtil = {
  merge: require('@antv/util/lib/array/merge')
};

var Adjust = require('./base');

var Symmetric =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Symmetric, _Adjust);

  function Symmetric() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Symmetric.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.cacheMax = null; // 缓存的最大值

    this.adjustNames = ['y']; // Only support stack y

    this.groupFields = null; // 参与分组的数据维度
  }; // 获取最大的y值


  _proto._getMax = function _getMax(dim) {
    var self = this;
    var mergeData = self.mergeData;
    var maxRecord = maxBy(mergeData, function (obj) {
      var value = obj[dim];

      if (isArray(value)) {
        return Math.max.apply(null, value);
      }

      return value;
    });
    var maxValue = maxRecord[dim];
    var max = isArray(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
    return max;
  }; // 获取每个字段最大的值


  _proto._getXValuesMax = function _getXValuesMax() {
    var self = this;
    var yField = self.yField;
    var xField = self.xField;
    var cache = {};
    var mergeData = self.mergeData;
    each(mergeData, function (obj) {
      var xValue = obj[xField];
      var yValue = obj[yField];
      var max = isArray(yValue) ? Math.max.apply(null, yValue) : yValue;
      cache[xValue] = cache[xValue] || 0;

      if (cache[xValue] < max) {
        cache[xValue] = max;
      }
    });
    return cache;
  }; // 入口函数


  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    self.mergeData = mergeData;

    self._processSymmetric(dataArray);

    self.mergeData = null;
  }; // 处理对称


  _proto._processSymmetric = function _processSymmetric(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;

    var max = self._getMax(yField);

    var first = dataArray[0][0];
    var cache;

    if (first && isArray(first[yField])) {
      cache = self._getXValuesMax();
    }

    each(dataArray, function (data) {
      each(data, function (obj) {
        var value = obj[yField];
        var offset;

        if (isArray(value)) {
          var xValue = obj[xField];
          var valueMax = cache[xValue];
          offset = (max - valueMax) / 2;
          var tmp = [];
          /* eslint-disable no-loop-func */

          each(value, function (subVal) {
            // 多个字段
            tmp.push(offset + subVal);
          });
          /* eslint-enable no-loop-func */

          obj[yField] = tmp;
        } else {
          offset = (max - value) / 2;
          obj[yField] = [offset, value + offset];
        }
      });
    });
  };

  return Symmetric;
}(Adjust);

Adjust.Symmetric = Symmetric;
module.exports = Symmetric;