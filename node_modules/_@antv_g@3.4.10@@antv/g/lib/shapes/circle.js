var Util = require('../util/index');

var Shape = require('../core/shape');

var Circle = function Circle(cfg) {
  Circle.superclass.constructor.call(this, cfg);
};

Circle.ATTRS = {
  x: 0,
  y: 0,
  r: 0,
  lineWidth: 1
};
Util.extend(Circle, Shape);
Util.augment(Circle, {
  canFill: true,
  canStroke: true,
  type: 'circle',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this._attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;
    var lineWidth = this.getHitLineWidth();
    var halfWidth = lineWidth / 2 + r;
    return {
      minX: cx - halfWidth,
      minY: cy - halfWidth,
      maxX: cx + halfWidth,
      maxY: cy + halfWidth
    };
  },
  createPath: function createPath(context) {
    var attrs = this._attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2, false);
    context.closePath();
  }
});
module.exports = Circle;