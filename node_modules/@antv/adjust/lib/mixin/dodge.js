var ArrayUtil = {
  merge: require('@antv/util/lib/array/merge'),
  values: require('@antv/util/lib/array/values-of-key')
};

var group = require('@antv/util/lib/group');

var each = require('@antv/util/lib/each');

module.exports = {
  /**
   * @protected
   * @override
   */
  processAdjust: function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    var dodgeDim = self.dodgeBy;
    var adjDataArray = dataArray;

    if (dodgeDim) {
      // 如果指定了分组dim的字段
      adjDataArray = group(mergeData, dodgeDim);
    }

    self.cacheMap = {};
    self.adjDataArray = adjDataArray;
    self.mergeData = mergeData;
    self.adjustData(adjDataArray, mergeData);
    self.adjDataArray = null;
    self.mergeData = null;
  },
  getDistribution: function getDistribution(dim) {
    var self = this;
    var dataArray = self.adjDataArray;
    var cacheMap = self.cacheMap;
    var map = cacheMap[dim];

    if (!map) {
      map = {};
      each(dataArray, function (data, index) {
        var values = ArrayUtil.values(data, dim);

        if (!values.length) {
          values.push(0);
        }

        each(values, function (val) {
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
  adjustDim: function adjustDim(dim, values, data, frameCount, frameIndex) {
    var self = this;
    var map = self.getDistribution(dim);
    var groupData = self.groupData(data, dim); // 根据值分组

    each(groupData, function (group, key) {
      key = parseFloat(key);
      var range;

      if (values.length === 1) {
        range = {
          pre: values[0] - 1,
          next: values[0] + 1
        };
      } else {
        range = self.getAdjustRange(dim, key, values);
      }

      each(group, function (record) {
        var value = record[dim];
        var valueArr = map[value];
        var valIndex = valueArr.indexOf(frameIndex);
        record[dim] = self.getDodgeOffset(range, valIndex, valueArr.length);
      });
    });
  }
};