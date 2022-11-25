const Util = require('../util/index');
const Shape = require('../core/shape');
const Arrow = require('./util/arrow');
const LineMath = require('./math/line');

const Line = function(cfg) {
  Line.superclass.constructor.call(this, cfg);
};

Line.ATTRS = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Line, Shape);

Util.augment(Line, {
  canStroke: true,
  type: 'line',
  getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox() {
    const attrs = this._attrs;
    const { x1, y1, x2, y2 } = attrs;
    const lineWidth = this.getHitLineWidth();
    return LineMath.box(x1, y1, x2, y2, lineWidth);
  },
  createPath(context) {
    const attrs = this._attrs;
    const { x1, y1, x2, y2 } = attrs;
    context = context || self.get('context');
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
  },
  afterPath(context) {
    const attrs = this._attrs;
    const { x1, y1, x2, y2 } = attrs;
    context = context || this.get('context');
    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, x2, y2, x1, y1);
    }
    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, x1, y1, x2, y2);
    }
  },
  getPoint(t) {
    const attrs = this._attrs;
    return {
      x: LineMath.at(attrs.x1, attrs.x2, t),
      y: LineMath.at(attrs.y1, attrs.y2, t)
    };
  }
});

module.exports = Line;
