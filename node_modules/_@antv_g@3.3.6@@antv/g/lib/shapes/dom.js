var Util = require('../util/index');

var Shape = require('../core/shape');

var Dom = function Dom(cfg) {
  Dom.superclass.constructor.call(this, cfg);
};

Util.extend(Dom, Shape);
Util.augment(Dom, {
  canFill: true,
  canStroke: true,
  type: 'dom',
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self._attrs;
    var x = attrs.x;
    var y = attrs.y;
    var width = attrs.width;
    var height = attrs.height;
    var lineWidth = this.getHitLineWidth();
    var halfWidth = lineWidth / 2;
    return {
      minX: x - halfWidth,
      minY: y - halfWidth,
      maxX: x + width + halfWidth,
      maxY: y + height + halfWidth
    };
  }
});
module.exports = Dom;