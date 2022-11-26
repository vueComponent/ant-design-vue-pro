const isString = require('@antv/util/lib/type/is-string');
const ColorUtil = require('./color-util');
const Base = require('./base');

class Color extends Base {

  constructor(cfg) {
    super(cfg);
    this.names = [ 'color' ];
    this.type = 'color';
    this.gradient = null;
    if (isString(this.values)) {
      this.linear = true;
    }
  }

  /**
   * @override
   */
  getLinearValue(percent) {
    let gradient = this.gradient;
    if (!gradient) {
      const values = this.values;
      gradient = ColorUtil.gradient(values);
      this.gradient = gradient;
    }
    return gradient(percent);
  }
}

module.exports = Color;
