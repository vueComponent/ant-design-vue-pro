var Util = require('../util/index');

var Shape = require('../core/shape');

var ArcMath = require('./math/arc');

var Arrow = require('./util/arrow');

function _getArcX(x, radius, angle) {
  return x + radius * Math.cos(angle);
}

function _getArcY(y, radius, angle) {
  return y + radius * Math.sin(angle);
}

var Arc = function Arc(cfg) {
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
  getDefaultAttrs: function getDefaultAttrs() {
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
  calculateBox: function calculateBox() {
    var attrs = this._attrs;
    var x = attrs.x,
        y = attrs.y,
        r = attrs.r,
        startAngle = attrs.startAngle,
        endAngle = attrs.endAngle,
        clockwise = attrs.clockwise;
    var lineWidth = this.getHitLineWidth();
    var halfWidth = lineWidth / 2;
    var box = ArcMath.box(x, y, r, startAngle, endAngle, clockwise);
    box.minX -= halfWidth;
    box.minY -= halfWidth;
    box.maxX += halfWidth;
    box.maxY += halfWidth;
    return box;
  },
  getStartTangent: function getStartTangent() {
    var attrs = this._attrs;
    var x = attrs.x,
        y = attrs.y,
        startAngle = attrs.startAngle,
        r = attrs.r,
        clockwise = attrs.clockwise;
    var diff = Math.PI / 180;

    if (clockwise) {
      diff *= -1;
    }

    var result = [];

    var x1 = _getArcX(x, r, startAngle + diff);

    var y1 = _getArcY(y, r, startAngle + diff);

    var x2 = _getArcX(x, r, startAngle);

    var y2 = _getArcY(y, r, startAngle);

    result.push([x1, y1]);
    result.push([x2, y2]);
    return result;
  },
  getEndTangent: function getEndTangent() {
    var attrs = this._attrs;
    var x = attrs.x,
        y = attrs.y,
        endAngle = attrs.endAngle,
        r = attrs.r,
        clockwise = attrs.clockwise;
    var diff = Math.PI / 180;
    var result = [];

    if (clockwise) {
      diff *= -1;
    }

    var x1 = _getArcX(x, r, endAngle + diff);

    var y1 = _getArcY(y, r, endAngle + diff);

    var x2 = _getArcX(x, r, endAngle);

    var y2 = _getArcY(y, r, endAngle);

    result.push([x2, y2]);
    result.push([x1, y1]);
    return result;
  },
  createPath: function createPath(context) {
    var attrs = this._attrs;
    var x = attrs.x,
        y = attrs.y,
        r = attrs.r,
        startAngle = attrs.startAngle,
        endAngle = attrs.endAngle,
        clockwise = attrs.clockwise;
    context = context || self.get('context');
    context.beginPath();
    context.arc(x, y, r, startAngle, endAngle, clockwise);
  },
  afterPath: function afterPath(context) {
    var attrs = this._attrs;
    context = context || this.get('context');

    if (attrs.startArrow) {
      var startPoints = this.getStartTangent();
      Arrow.addStartArrow(context, attrs, startPoints[0][0], startPoints[0][1], startPoints[1][0], startPoints[1][1]);
    }

    if (attrs.endArrow) {
      var endPoints = this.getEndTangent();
      Arrow.addEndArrow(context, attrs, endPoints[0][0], endPoints[0][1], endPoints[1][0], endPoints[1][1]);
    }
  }
});
module.exports = Arc;