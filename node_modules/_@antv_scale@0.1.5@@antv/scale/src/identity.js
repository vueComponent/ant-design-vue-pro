const Base = require('./base');
const isNumber = require('@antv/util/lib/type/is-number');

class Identity extends Base {

  _initDefaultCfg() {
    super._initDefaultCfg();
    this.isIdentity = true;
    this.type = 'identity';
    /**
     * 常量值
     * @type {*}
     */
    this.value = null;
  }

  /**
   * @override
   */
  getText() {
    return this.value.toString();
  }

  /**
   * @override
   */
  scale(value) {
    if (this.value !== value && isNumber(value)) {
      return value;
    }
    return this.range[0];
  }

  /**
   * @override
   */
  invert() {
    return this.value;
  }
}

Base.Identity = Identity;
module.exports = Identity;
