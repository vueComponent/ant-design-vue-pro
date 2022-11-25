const ArrayUtil = {
  merge: require('@antv/util/lib/array/merge'),
  values: require('@antv/util/lib/array/values-of-key')
};

const group = require('@antv/util/lib/group');
const each = require('@antv/util/lib/each');

module.exports = {
  /**
   * @protected
   * @override
   */
  processAdjust(dataArray) {
    const self = this;
    const mergeData = ArrayUtil.merge(dataArray);
    const dodgeDim = self.dodgeBy;
    let adjDataArray = dataArray;
    if (dodgeDim) { // 如果指定了分组dim的字段
      adjDataArray = group(mergeData, dodgeDim);
    }
    self.cacheMap = {};
    self.adjDataArray = adjDataArray;
    self.mergeData = mergeData;
    self.adjustData(adjDataArray, mergeData);

    self.adjDataArray = null;
    self.mergeData = null;
  },
  getDistribution(dim) {
    const self = this;
    const dataArray = self.adjDataArray;
    const cacheMap = self.cacheMap;
    let map = cacheMap[dim];
    if (!map) {
      map = {};
      each(dataArray, function(data, index) {
        const values = ArrayUtil.values(data, dim);
        if (!values.length) {
          values.push(0);
        }
        each(values, function(val) {
          if (!map[val]) {
            map[val] = [];
          }
          map[val].push(index);
        });
      });
      cacheMap[dim] = map;
    }

    return map;
  },
  adjustDim(dim, values, data, frameCount, frameIndex) {
    const self = this;
    const map = self.getDistribution(dim);
    const groupData = self.groupData(data, dim); // 根据值分组

    each(groupData, function(group, key) {
      key = parseFloat(key);
      let range;
      if (values.length === 1) {
        range = {
          pre: values[0] - 1,
          next: values[0] + 1
        };
      } else {
        range = self.getAdjustRange(dim, key, values);
      }
      each(group, function(record) {
        const value = record[dim];
        const valueArr = map[value];
        const valIndex = valueArr.indexOf(frameIndex);
        record[dim] = self.getDodgeOffset(range, valIndex, valueArr.length);
      });
    });
  }
};
