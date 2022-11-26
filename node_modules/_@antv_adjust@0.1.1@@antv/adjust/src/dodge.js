const Adjust = require('./base');
const each = require('@antv/util/lib/each');

const MARGIN_RATIO = 1 / 2;
const DODGE_RATIO = 1 / 2;

class Dodge extends Adjust {

  _initDefaultCfg() {
    /**
     * 调整过程中,2个数据的间距
     * @type {Number}
     */
    this.marginRatio = MARGIN_RATIO;
    /**
     * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
     * @type {Number}
     */
    this.dodgeRatio = DODGE_RATIO;
    this.adjustNames = [ 'x', 'y' ]; // 调整的维度，默认,x,y都做调整
  }

  getDodgeOffset(range, index, count) {
    const self = this;
    const pre = range.pre;
    const next = range.next;
    const tickLength = next - pre;
    const width = (tickLength * self.dodgeRatio) / count;
    const margin = self.marginRatio * width;
    const offset = 1 / 2 * (tickLength - (count) * width - (count - 1) * margin) +
      ((index + 1) * width + index * margin) -
      1 / 2 * width - 1 / 2 * tickLength;
    return (pre + next) / 2 + offset;
  }

  processAdjust(dataArray) {
    const self = this;
    const count = dataArray.length;
    const xField = self.xField;
    each(dataArray, function(data, index) {
      for (let i = 0, len = data.length; i < len; i++) {
        const obj = data[i];
        const value = obj[xField];
        const range = {
          pre: len === 1 ? value - 1 : value - 0.5,
          next: len === 1 ? value + 1 : value + 0.5
        };
        const dodgeValue = self.getDodgeOffset(range, index, count);
        obj[xField] = dodgeValue;
      }
    });
  }
}

Adjust.Dodge = Dodge;
module.exports = Dodge;
