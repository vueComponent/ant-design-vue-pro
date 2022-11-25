/**
 * @fileOverview 时间数据作为分类类型
 * @author dxq613@gmail.com
 */
const Base = require('./base');
const Category = require('./category');
const fecha = require('fecha');
const catAuto = require('./auto/cat');
const TimeUtil = require('./time-util');

const each = require('@antv/util/lib/each');
const isNumber = require('@antv/util/lib/type/is-number');
const isObject = require('@antv/util/lib/type/is-object');
const isString = require('@antv/util/lib/type/is-string');

/**
 * 度量的构造函数
 * @class Scale.TimeCategory
 */
class TimeCategory extends Category {
  _initDefaultCfg() {
    super._initDefaultCfg();

    this.type = 'timeCat';
    /**
     * 是否需要排序，默认进行排序
     * @type {Boolean}
     */
    this.sortable = true;
    this.tickCount = 5;
    /**
     * 时间格式化
     * @type {String}
     */
    this.mask = 'YYYY-MM-DD';
  }

  init() {
    const self = this;
    const values = this.values;
    // 针对时间分类类型，会将时间统一转换为时间戳
    each(values, function(v, i) {
      values[i] = self._toTimeStamp(v);
    });
    if (this.sortable) { // 允许排序
      values.sort(function(v1, v2) {
        return v1 - v2;
      });
    }

    if (!self.ticks) {
      self.ticks = this.calculateTicks();
    }
  }

  /**
   * 计算 ticks
   * @return {array} 返回 ticks 数组
   */
  calculateTicks() {
    const self = this;
    const count = self.tickCount;
    let ticks;
    if (count) {
      const temp = catAuto({
        maxCount: count,
        data: self.values,
        isRounding: self.isRounding
      });
      ticks = temp.ticks;
    } else {
      ticks = self.values;
    }

    return ticks;
  }

  /**
   * @override
   */
  translate(value) {
    value = this._toTimeStamp(value);
    let index = this.values.indexOf(value);

    if (index === -1) {
      if (isNumber(value) && value < this.values.length) {
        index = value;
      } else {
        index = NaN;
      }
    }
    return index;
  }

  /**
   * @override
   */
  scale(value) {
    const rangeMin = this.rangeMin();
    const rangeMax = this.rangeMax();
    const index = this.translate(value);

    let percent;
    if (this.values.length === 1 || isNaN(index)) { // is index is NAN should not be set as 0
      percent = index;
    } else if (index > -1) {
      percent = (index) / (this.values.length - 1);
    } else {
      percent = 0;
    }

    return rangeMin + percent * (rangeMax - rangeMin);
  }

  /**
   * @override
   */
  getText(value) {
    let result = '';
    const index = this.translate(value);
    if (index > -1) {
      result = this.values[index];
    } else {
      result = value;
    }

    const formatter = this.formatter;
    result = parseInt(result, 10);
    result = formatter ? formatter(result) : fecha.format(result, this.mask);
    return result;
  }

  /**
   * @override
   */
  getTicks() {
    const self = this;
    const ticks = this.ticks;
    const rst = [];
    each(ticks, function(tick) {
      let obj;
      if (isObject(tick)) {
        obj = tick;
      } else {
        obj = {
          text: isString(tick) ? tick : self.getText(tick),
          value: self.scale(tick),
          tickValue: tick // 用于坐标轴上文本动画时确定前后帧的对应关系
        };
      }
      rst.push(obj);
    });
    return rst;
  }

  // 将时间转换为时间戳
  _toTimeStamp(value) {
    return TimeUtil.toTimeStamp(value);
  }
}

Base.TimeCat = TimeCategory;
module.exports = TimeCategory;
