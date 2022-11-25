const each = require('@antv/util/lib/each');
const mix = require('@antv/util/lib/mix');
const ArrayUtil = {
  merge: require('@antv/util/lib/array/merge')
};

const Adjust = require('./base');
const AdjustMixin = require('./mixin/adjust');

class Jitter extends Adjust {

  _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称
    this.yField = null; // 调整对应的 y 方向对应的字段名称
    this.adjustNames = [ 'x', 'y' ]; // 指x,y
    this.groupFields = null; // 参与分组的数据维度
  }

  processAdjust(dataArray) {
    const self = this;
    const mergeData = ArrayUtil.merge(dataArray);

    self.adjDataArray = dataArray;
    self.mergeData = mergeData;
    self.adjustData(dataArray, mergeData);
    self.adjFrames = null;
    self.mergeData = null;
  }

  getAdjustOffset(pre, next) {
    const r = Math.random(); // 随机位置，均匀分布
    const avg = (next - pre); // * length
    const append = avg * 0.05;
    return pre + append + avg * 0.9 * r;
  }

  // adjust group data
  _adjustGroup(group, dim, key, values) {
    const self = this;
    const range = self.getAdjustRange(dim, key, values);

    each(group, function(record) {
      record[dim] = self.getAdjustOffset(range.pre, range.next); // 获取调整的位置
    });
  }

  adjustDim(dim, values, data) {
    const self = this;
    const groupData = self.groupData(data, dim);
    each(groupData, function(group, key) {
      key = parseFloat(key);
      self._adjustGroup(group, dim, key, values);
    });
  }
}

mix(Jitter.prototype, AdjustMixin);

Adjust.Jitter = Jitter;
module.exports = Jitter;
