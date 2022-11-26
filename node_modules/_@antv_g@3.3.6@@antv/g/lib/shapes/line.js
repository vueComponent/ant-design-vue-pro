var Util = require('../util/index');

var Shape = require('../core/shape');

var Arrow = require('./util/arrow');

var LineMath = require('./math/line');

var Line = function Line(cfg) {
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
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this._attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;
    var lineWidth = this.getHitLineWidth();
    return LineMath.box(x1, y1, x2, y2, lineWidth);
  },
  createPath: function createPath(context) {
    var attrs = this._attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;
    context = context || self.get('context');
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
  },
  afterPath: function afterPath(context) {
    var attrs = this._attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;
    context = context || this.get('context');

    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, x2, y2, x1, y1);
    }

    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, x1, y1, x2, y2);
    }
  },
  getPoint: function getPoint(t) {
    var attrs = this._attrs;
    return {
      x: LineMath.at(attrs.x1, attrs.x2, t),
      y: LineMath.at(attrs.y1, attrs.y2, t)
    };
  }
});
module.exports = Line;