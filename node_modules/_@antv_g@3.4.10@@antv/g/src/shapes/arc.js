const Util = require('../util/index');
const Shape = require('../core/shape');
const ArcMath = require('./math/arc');
const Arrow = require('./util/arrow');

function _getArcX(x, radius, angle) {
  return x + (radius * Math.cos(angle));
}
function _getArcY(y, radius, angle) {
  return y + (radius * Math.sin(angle));
}

const Arc = function(cfg) {
  Arc.superclass.constructor.call(this, cfg);
};

Arc.ATTRS = {
  x: 0,
  y: 0,
  r: 0,
  startAngle: 0,
  endAngle: 0,
  clockwise: false,
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Arc, Shape);

Util.augment(Arc, {
  canStroke: true,
  type: 'arc',
  getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      clockwise: false,
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox() {
    const attrs = this._attrs;
    const { x, y, r, startAngle, endAngle, clockwise } = attrs;
    const lineWidth = this.getHitLineWidth();
    const halfWidth = lineWidth / 2;
    const box = ArcMath.box(x, y, r, startAngle, endAngle, clockwise);
    box.minX -= halfWidth;
    box.minY -= halfWidth;
    box.maxX += halfWidth;
    box.maxY += halfWidth;
    return box;
  },
  getStartTangent() {
    const attrs = this._attrs;
    const { x, y, startAngle, r, clockwise } = attrs;
    let diff = Math.PI / 180;
    if (clockwise) {
      diff *= -1;
    }
    const result = [];
    const x1 = _getArcX(x, r, startAngle + diff);
    const y1 = _getArcY(y, r, startAngle + diff);
    const x2 = _getArcX(x, r, startAngle);
    const y2 = _getArcY(y, r, startAngle);
    result.push([ x1, y1 ]);
    result.push([ x2, y2 ]);
    return result;

  },
  getEndTangent() {
    const attrs = this._attrs;
    const { x, y, endAngle, r, clockwise } = attrs;
    let diff = Math.PI / 180;
    const result = [];
    if (clockwise) {
      diff *= -1;
    }
    const x1 = _getArcX(x, r, endAngle + diff);
    const y1 = _getArcY(y, r, endAngle + diff);
    const x2 = _getArcX(x, r, endAngle);
    const y2 = _getArcY(y, r, endAngle);
    result.push([ x2, y2 ]);
    result.push([ x1, y1 ]);
    return result;
  },
  createPath(context) {
    const attrs = this._attrs;
    const { x, y, r, startAngle, endAngle, clockwise } = attrs;
    context = context || self.get('context');

    context.beginPath();
    context.arc(x, y, r, startAngle, endAngle, clockwise);
  },
  afterPath(context) {
    const attrs = this._attrs;
    context = context || this.get('context');

    if (attrs.startArrow) {
      const startPoints = this.getStartTangent();
      Arrow.addStartArrow(context, attrs, startPoints[0][0], startPoints[0][1], startPoints[1][0], startPoints[1][1]);
    }

    if (attrs.endArrow) {
      const endPoints = this.getEndTangent();
      Arrow.addEndArrow(context, attrs, endPoints[0][0], endPoints[0][1], endPoints[1][0], endPoints[1][1]);
    }
  }
});

module.exports = Arc;
