const isArray = require('@antv/util/lib/type/is-array');
const isNil = require('@antv/util/lib/type/is-nil');
const Adjust = require('./base');

class Stack extends Adjust {

  _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称
    this.yField = null; // 调整对应的 y 方向对应的字段名称
  }

  processAdjust(dataArray) {
    this.processStack(dataArray);
  }

  processStack(dataArray) {
    const self = this;
    const xField = self.xField;
    const yField = self.yField;
    const count = dataArray.length;
    const stackCache = {
      positive: {},
      negative: {}
    };
    // 层叠顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (let i = 0; i < count; i++) {
      const data = dataArray[i];
      for (let j = 0, len = data.length; j < len; j++) {
        const item = data[j];
        const x = item[xField] || 0;
        let y = item[yField];
        const xkey = x.toString();
        y = isArray(y) ? y[1] : y;
        if (!isNil(y)) {
          const direction = y >= 0 ? 'positive' : 'negative';
          if (!stackCache[direction][xkey]) {
            stackCache[direction][xkey] = 0;
          }
          item[yField] = [ stackCache[direction][xkey], y + stackCache[direction][xkey] ];
          stackCache[direction][xkey] += y;
        }
      }
    }
  }
}

Adjust.Stack = Stack;
module.exports = Stack;
