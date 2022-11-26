module.exports = {
  _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称
    this.yField = null; // 调整对应的 y 方向对应的字段名称
    this.height = null; // 仅有一个维度调整时，总的高度
    this.size = 10; // 单个点的大小
    this.reverseOrder = false; // 是否反序进行层叠
    this.adjustNames = [ 'y' ]; // Only support stack y
  },
  processOneDimStack(dataArray) {
    const self = this;
    const xField = self.xField;
    const yField = self.yField || 'y';
    const height = self.height;

    const stackY = {};
    // 如果层叠的顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (let i = 0, len = dataArray.length; i < len; i++) {
      const data = dataArray[i];
      // cates
      for (let j = 0, dataLen = data.length; j < dataLen; j++) {
        const item = data[j];
        const size = item.size || self.size;
        const stackHeight = (size * 2) / height;
        const x = item[xField];
        if (!stackY[x]) {
          stackY[x] = stackHeight / 2;
        }
        item[yField] = stackY[x];
        stackY[x] += stackHeight;
      }
    }
  },
  processAdjust(dataArray) {
    if (this.yField) {
      this.processStack(dataArray);
    } else {
      this.processOneDimStack(dataArray);
    }
  }
};
