const each = require('@antv/util/lib/each');
const maxBy = require('@antv/util/lib/math/max-by');
const isArray = require('@antv/util/lib/type/is-array');
const ArrayUtil = {
  merge: require('@antv/util/lib/array/merge')
};
const Adjust = require('./base');

class Symmetric extends Adjust {

  _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称
    this.yField = null; // 调整对应的 y 方向对应的字段名称
    this.cacheMax = null; // 缓存的最大值
    this.adjustNames = [ 'y' ]; // Only support stack y
    this.groupFields = null; // 参与分组的数据维度
  }

  // 获取最大的y值
  _getMax(dim) {
    const self = this;
    const mergeData = self.mergeData;
    const maxRecord = maxBy(mergeData, obj => {
      const value = obj[dim];
      if (isArray(value)) {
        return Math.max.apply(null, value);
      }
      return value;
    });
    const maxValue = maxRecord[dim];
    const max = isArray(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
    return max;
  }

  // 获取每个字段最大的值
  _getXValuesMax() {
    const self = this;
    const yField = self.yField;
    const xField = self.xField;
    const cache = {};
    const mergeData = self.mergeData;
    each(mergeData, function(obj) {
      const xValue = obj[xField];
      const yValue = obj[yField];
      const max = isArray(yValue) ? Math.max.apply(null, yValue) : yValue;
      cache[xValue] = cache[xValue] || 0;
      if (cache[xValue] < max) {
        cache[xValue] = max;
      }
    });
    return cache;
  }

  // 入口函数
  processAdjust(dataArray) {
    const self = this;
    const mergeData = ArrayUtil.merge(dataArray);
    self.mergeData = mergeData;
    self._processSymmetric(dataArray);
    self.mergeData = null;
  }

  // 处理对称
  _processSymmetric(dataArray) {
    const self = this;
    const xField = self.xField;
    const yField = self.yField;
    const max = self._getMax(yField);
    const first = dataArray[0][0];

    let cache;
    if (first && isArray(first[yField])) {
      cache = self._getXValuesMax();
    }
    each(dataArray, function(data) {
      each(data, function(obj) {
        const value = obj[yField];
        let offset;
        if (isArray(value)) {
          const xValue = obj[xField];
          const valueMax = cache[xValue];
          offset = (max - valueMax) / 2;
          const tmp = [];
          /* eslint-disable no-loop-func */
          each(value, function(subVal) { // 多个字段
            tmp.push(offset + subVal);
          });
          /* eslint-enable no-loop-func */
          obj[yField] = tmp;
        } else {
          offset = (max - value) / 2;
          obj[yField] = [ offset, value + offset ];
        }
      });
    });
  }
}

Adjust.Symmetric = Symmetric;
module.exports = Symmetric;
