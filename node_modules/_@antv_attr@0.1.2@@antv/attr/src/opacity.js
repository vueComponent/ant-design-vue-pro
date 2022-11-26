const Base = require('./base');

class Opacity extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = [ 'opacity' ];
    this.type = 'opacity';
    this.gradient = null;
  }
}

module.exports = Opacity;
