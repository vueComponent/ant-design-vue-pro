const Base = require('./base');

class Shape extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'shape' ];
    this.type = 'shape';
    this.gradient = null;
  }

  /**
   * @override
   */
  getLinearValue(percent) {
    const values = this.values;
    const index = Math.round((values.length - 1) * percent);
    return values[index];
  }
}

module.exports = Shape;
