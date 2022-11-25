module.exports = {
  _initDefaultCfg: function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.height = null; // 仅有一个维度调整时，总的高度

    this.size = 10; // 单个点的大小

    this.reverseOrder = false; // 是否反序进行层叠

    this.adjustNames = ['y']; // Only support stack y
  },
  processOneDimStack: function processOneDimStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField || 'y';
    var height = self.height;
    var stackY = {}; // 如果层叠的顺序翻转

    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }

    for (var i = 0, len = dataArray.length; i < len; i++) {
      var data = dataArray[i]; // cates

      for (var j = 0, dataLen = data.length; j < dataLen; j++) {
        var item = data[j];
        var size = item.size || self.size;
        var stackHeight = size * 2 / height;
        var x = item[xField];

        if (!stackY[x]) {
          stackY[x] = stackHeight / 2;
        }

        item[yField] = stackY[x];
        stackY[x] += stackHeight;
      }
    }
  },
  processAdjust: function processAdjust(dataArray) {
    if (this.yField) {
      this.processStack(dataArray);
    } else {
      this.processOneDimStack(dataArray);
    }
  }
};