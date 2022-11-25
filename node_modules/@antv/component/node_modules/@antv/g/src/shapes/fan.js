const Util = require('../util/index');
const Shape = require('../core/shape');
const ArcMath = require('./math/arc');

const Fan = function(cfg) {
  Fan.superclass.constructor.call(this, cfg);
};

Fan.ATTRS = {
  x: 0,
  y: 0,
  rs: 0,
  re: 0,
  startAngle: 0,
  endAngle: 0,
  clockwise: false,
  lineWidth: 1
};

Util.extend(Fan, Shape);

Util.augment(Fan, {
  canFill: true,
  canStroke: true,
  type: 'fan',
  getDefaultAttrs() {
    return {
      clockwise: false,
      lineWidth: 1,
      rs: 0,
      re: 0
    };
  },
  calculateBox() {
    const self = this;
    const attrs = self._attrs;
    const cx = attrs.x;
    const cy = attrs.y;
    const rs = attrs.rs;
    const re = attrs.re;
    const startAngle = attrs.startAngle;
    const endAngle = attrs.endAngle;
    const clockwise = attrs.clockwise;
    const lineWidth = this.getHitLineWidth();

    const boxs = ArcMath.box(cx, cy, rs, startAngle, endAngle, clockwise);
    const boxe = ArcMath.box(cx, cy, re, startAngle, endAngle, clockwise);
    const minX = Math.min(boxs.minX, boxe.minX);
    const minY = Math.min(boxs.minY, boxe.minY);
    const maxX = Math.max(boxs.maxX, boxe.maxX);
    const maxY = Math.max(boxs.maxY, boxe.maxY);

    const halfWidth = lineWidth / 2;
    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
    };
  },
  createPath(context) {
    const attrs = this._attrs;
    const cx = attrs.x;
    const cy = attrs.y;
    const rs = attrs.rs;
    const re = attrs.re;
    const startAngle = attrs.startAngle;
    const endAngle = attrs.endAngle;
    const clockwise = attrs.clockwise;

    const ssp = {
      x: Math.cos(startAngle) * rs + cx,
      y: Math.sin(startAngle) * rs + cy
    };
    const sep = {
      x: Math.cos(startAngle) * re + cx,
      y: Math.sin(startAngle) * re + cy
    };
    const esp = {
      x: Math.cos(endAngle) * rs + cx,
      y: Math.sin(endAngle) * rs + cy
    };

    context = context || self.get('context');
    context.beginPath();
    context.moveTo(ssp.x, ssp.y);
    context.lineTo(sep.x, sep.y);
    context.arc(cx, cy, re, startAngle, endAngle, clockwise);
    context.lineTo(esp.x, esp.y);
    context.arc(cx, cy, rs, endAngle, startAngle, !clockwise);
    context.closePath();
  }
});

module.exports = Fan;
