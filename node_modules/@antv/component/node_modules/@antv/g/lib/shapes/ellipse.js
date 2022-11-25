var Util = require('../util/index');

var Shape = require('../core/shape');

var Ellipse = function Ellipse(cfg) {
  Ellipse.superclass.constructor.call(this, cfg);
};

Ellipse.ATTRS = {
  x: 0,
  y: 0,
  rx: 1,
  ry: 1,
  lineWidth: 1
};
Util.extend(Ellipse, Shape);
Util.augment(Ellipse, {
  canFill: true,
  canStroke: true,
  type: 'ellipse',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this._attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rx = attrs.rx;
    var ry = attrs.ry;
    var lineWidth = this.getHitLineWidth();
    var halfXWidth = rx + lineWidth / 2;
    var halfYWidth = ry + lineWidth / 2;
    return {
      minX: cx - halfXWidth,
      minY: cy - halfYWidth,
      maxX: cx + halfXWidth,
      maxY: cy + halfYWidth
    };
  },
  createPath: function createPath(context) {
    var attrs = this._attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rx = attrs.rx;
    var ry = attrs.ry;
    context = context || self.get('context');
    var r = rx > ry ? rx : ry;
    var scaleX = rx > ry ? 1 : rx / ry;
    var scaleY = rx > ry ? ry / rx : 1;
    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    Util.mat3.scale(m, m, [scaleX, scaleY]);
    Util.mat3.translate(m, m, [cx, cy]);
    context.beginPath();
    context.save();
    context.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    context.arc(0, 0, r, 0, Math.PI * 2);
    context.restore();
    context.closePath();
  }
});
module.exports = Ellipse;