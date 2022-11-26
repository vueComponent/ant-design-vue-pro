/**
 * @fileOverview The measurement of linear data scale function
 * @author dxq613@gmail.com
 */
const isNil = require('@antv/util/lib/type/is-nil');
const each = require('@antv/util/lib/each');

const Base = require('./base');
const numberAuto = require('./auto/number');

/**
 * 线性度量
 * @class Scale.Linear
 */
class Linear extends Base {

  _initDefaultCfg() {
    super._initDefaultCfg();
    const self = this;

    self.type = 'linear';
    self.isLinear = true;
    /**
     * 是否为了用户习惯，优化min,max和ticks，如果进行优化，则会根据生成的ticks调整min,max，否则舍弃(min,max)范围之外的ticks
     * @type {Boolean}
     * @default false
     */
    self.nice = false;
    /**
     * min value of the scale
     * @type {Number}
     * @default null
     */
    self.min = null;
    /**
     * min value limitted of the scale
     * @type {Number}
     * @default null
     */
    self.minLimit = null;
    /**
     * max value of the scale
     * @type {Number}
     * @default null
     */
    self.max = null;
    /**
     * max value limitted of the scale
     * @type {Number}
     * @default null
     */
    self.maxLimit = null;
    /**
     * 自动生成标记时的个数
     * @type {Number}
     * @default null
     */
    self.tickCount = null;
    /**
     * 坐标轴点之间的间距，指的是真实数据的差值
     * @type {Number}
     * @default null
     */
    self.tickInterval = null;
    /**
     * 坐标轴点之间的最小间距，指的是真实数据的差值
     * @type {Number}
     * @default null
     */
    self.minTickInterval = null;
    /**
     * 用于计算坐标点时逼近的数组
     * @type {Array}
     */
    self.snapArray = null;
  }

  /**
   * @protected
   * @override
   */
  init() {
    const self = this;
    if (!self.ticks) {
      self.min = self.translate(self.min);
      self.max = self.translate(self.max);
      self.initTicks();
    } else {
      const ticks = self.ticks;
      const firstValue = self.translate(ticks[0]);
      const lastValue = self.translate(ticks[ticks.length - 1]);
      if (isNil(self.min) || self.min > firstValue) {
        self.min = firstValue;
      }
      if (isNil(self.max) || self.max < lastValue) {
        self.max = lastValue;
      }
    }
  }

  /**
   * 计算坐标点
   * @protected
   * @return {Array} 计算完成的坐标点
   */
  calculateTicks() {
    const { min, max, minLimit, maxLimit, tickCount, tickInterval, minTickInterval, snapArray } = this;

    if (tickCount === 1) {
      throw new Error('linear scale\'tickCount should not be 1');
    }
    if (max < min) {
      throw new Error(`max: ${max} should not be less than min: ${min}`);
    }
    const tmp = numberAuto({
      min,
      max,
      minLimit,
      maxLimit,
      minCount: tickCount,
      maxCount: tickCount,
      interval: tickInterval,
      minTickInterval,
      snapArray
    });
    return tmp.ticks;
  }

  // 初始化ticks
  initTicks() {
    const self = this;
    const calTicks = self.calculateTicks();
    if (self.nice) { // 如果需要优化显示的tick
      self.ticks = calTicks;
      self.min = calTicks[0];
      self.max = calTicks[calTicks.length - 1];
    } else {
      const ticks = [];
      each(calTicks, tick => {
        if (tick >= self.min && tick <= self.max) {
          ticks.push(tick);
        }
      });

      // 如果 ticks 为空，直接输入最小值、最大值
      if (!ticks.length) {
        ticks.push(self.min);
        ticks.push(self.max);
      }

      self.ticks = ticks;
    }
  }

  /**
   * @override
   */
  scale(value) {
    if (isNil(value)) {
      return NaN;
    }
    const max = this.max;
    const min = this.min;
    if (max === min) {
      return 0;
    }

    const percent = (value - min) / (max - min);
    const rangeMin = this.rangeMin();
    const rangeMax = this.rangeMax();
    return rangeMin + percent * (rangeMax - rangeMin);
  }

  /**
   * @override
   */
  invert(value) {
    const percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    return this.min + percent * (this.max - this.min);
  }
}

Base.Linear = Linear;
module.exports = Linear;
