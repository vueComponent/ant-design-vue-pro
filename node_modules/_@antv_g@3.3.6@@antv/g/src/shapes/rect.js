const Util = require('../util/index');
const { parseRadius } = require('../util/format');
const Shape = require('../core/shape');

const Rect = function(cfg) {
  Rect.superclass.constructor.call(this, cfg);
};

Rect.ATTRS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 0,
  lineWidth: 1
};

Util.extend(Rect, Shape);

Util.augment(Rect, {
  canFill: true,
  canStroke: true,
  type: 'rect',
  getDefaultAttrs() {
    return {
      lineWidth: 1,
      radius: 0
    };
  },
  calculateBox() {
    const self = this;
    const attrs = self._attrs;
    const x = attrs.x;
    const y = attrs.y;
    const width = attrs.width;
    const height = attrs.height;
    const lineWidth = this.getHitLineWidth();

    const halfWidth = lineWidth / 2;
    return {
      minX: x - halfWidth,
      minY: y - halfWidth,
      maxX: x + width + halfWidth,
      maxY: y + height + halfWidth
    };
  },
  createPath(context) {
    const self = this;
    const attrs = self._attrs;
    const x = attrs.x;
    const y = attrs.y;
    const width = attrs.width;
    const height = attrs.height;
    const radius = attrs.radius;
    context = context || self.get('context');

    context.beginPath();
    if (radius === 0) {
      // 改成原生的rect方法
      context.rect(x, y, width, height);
    } else {
      const r = parseRadius(radius);
      context.moveTo(x + r.r1, y);
      context.lineTo(x + width - r.r2, y);
      r.r2 !== 0 && context.arc(x + width - r.r2, y + r.r2, r.r2, -Math.PI / 2, 0);
      context.lineTo(x + width, y + height - r.r3);
      r.r3 !== 0 && context.arc(x + width - r.r3, y + height - r.r3, r.r3, 0, Math.PI / 2);
      context.lineTo(x + r.r4, y + height);
      r.r4 !== 0 && context.arc(x + r.r4, y + height - r.r4, r.r4, Math.PI / 2, Math.PI);
      context.lineTo(x, y + r.r1);
      r.r1 !== 0 && context.arc(x + r.r1, y + r.r1, r.r1, Math.PI, Math.PI * 1.5);
      context.closePath();
    }
  }
});

module.exports = Rect;
