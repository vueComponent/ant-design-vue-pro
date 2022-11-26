function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var each = require('@antv/util/lib/each');

var mix = require('@antv/util/lib/mix');

var ArrayUtil = {
  merge: require('@antv/util/lib/array/merge')
};

var Adjust = require('./base');

var AdjustMixin = require('./mixin/adjust');

var Jitter =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Jitter, _Adjust);

  function Jitter() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Jitter.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.adjustNames = ['x', 'y']; // 指x,y

    this.groupFields = null; // 参与分组的数据维度
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    self.adjDataArray = dataArray;
    self.mergeData = mergeData;
    self.adjustData(dataArray, mergeData);
    self.adjFrames = null;
    self.mergeData = null;
  };

  _proto.getAdjustOffset = function getAdjustOffset(pre, next) {
    var r = Math.random(); // 随机位置，均匀分布

    var avg = next - pre; // * length

    var append = avg * 0.05;
    return pre + append + avg * 0.9 * r;
  }; // adjust group data


  _proto._adjustGroup = function _adjustGroup(group, dim, key, values) {
    var self = this;
    var range = self.getAdjustRange(dim, key, values);
    each(group, function (record) {
      record[dim] = self.getAdjustOffset(range.pre, range.next); // 获取调整的位置
    });
  };

  _proto.adjustDim = function adjustDim(dim, values, data) {
    var self = this;
    var groupData = self.groupData(data, dim);
    each(groupData, function (group, key) {
      key = parseFloat(key);

      self._adjustGroup(group, dim, key, values);
    });
  };

  return Jitter;
}(Adjust);

mix(Jitter.prototype, AdjustMixin);
Adjust.Jitter = Jitter;
module.exports = Jitter;