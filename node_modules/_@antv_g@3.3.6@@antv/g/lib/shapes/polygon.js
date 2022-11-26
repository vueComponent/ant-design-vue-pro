var Util = require('../util/index');

var Shape = require('../core/shape');

var Polygon = function Polygon(cfg) {
  Polygon.superclass.constructor.call(this, cfg);
};

Polygon.ATTRS = {
  points: null,
  lineWidth: 1
};
Util.extend(Polygon, Shape);
Util.augment(Polygon, {
  canFill: true,
  canStroke: true,
  type: 'polygon',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self._attrs;
    var points = attrs.points;
    var lineWidth = this.getHitLineWidth();

    if (!points || points.length === 0) {
      return null;
    }

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    Util.each(points, function (point) {
      var x = point[0];
      var y = point[1];

      if (x < minX) {
        minX = x;
      }

      if (x > maxX) {
        maxX = x;
      }

      if (y < minY) {
        minY = y;
      }

      if (y > maxY) {
        maxY = y;
      }
    });
    var halfWidth = lineWidth / 2;
    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
    };
  },
  createPath: function createPath(context) {
    var self = this;
    var attrs = self._attrs;
    var points = attrs.points;

    if (points.length < 2) {
      return;
    }

    context = context || self.get('context');
    context.beginPath();
    Util.each(points, function (point, index) {
      if (index === 0) {
        context.moveTo(point[0], point[1]);
      } else {
        context.lineTo(point[0], point[1]);
      }
    });
    context.closePath();
  }
});
module.exports = Polygon;