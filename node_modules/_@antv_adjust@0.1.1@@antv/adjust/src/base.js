const mix = require('@antv/util/lib/mix');

class Adjust {

  _initDefaultCfg() {
    this.adjustNames = [ 'x', 'y' ]; // 调整的维度，默认,x,y都做调整
  }

  constructor(cfg) {
    this._initDefaultCfg();
    mix(this, cfg);
  }

  /**
   * @override
   */
  processAdjust(/* dataArray */) {}
}


module.exports = Adjust;
