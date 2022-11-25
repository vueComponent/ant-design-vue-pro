var Line = require('../math/line');

var Quadratic = require('../math/quadratic');

var Cubic = require('../math/cubic');

var Arc = require('../math/arc');

module.exports = {
  line: function line(x1, y1, x2, y2, lineWidth, x, y) {
    var box = Line.box(x1, y1, x2, y2, lineWidth);

    if (!this.box(box.minX, box.maxX, box.minY, box.maxY, x, y)) {
      return false;
    }

    var d = Line.pointDistance(x1, y1, x2, y2, x, y);

    if (isNaN(d)) {
      return false;
    }

    return d <= lineWidth / 2;
  },
  polyline: function polyline(points, lineWidth, x, y) {
    var l = points.length - 1;

    if (l < 1) {
      return false;
    }

    for (var i = 0; i < l; i++) {
      var x1 = points[i][0];
      var y1 = points[i][1];
      var x2 = points[i + 1][0];
      var y2 = points[i + 1][1];

      if (this.line(x1, y1, x2, y2, lineWidth, x, y)) {
        return true;
      }
    }

    return false;
  },
  cubicline: function cubicline(x1, y1, x2, y2, x3, y3, x4, y4, lineWidth, x, y) {
    return Cubic.pointDistance(x1, y1, x2, y2, x3, y3, x4, y4, x, y) <= lineWidth / 2;
  },
  quadraticline: function quadraticline(x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    return Quadratic.pointDistance(x1, y1, x2, y2, x3, y3, x, y) <= lineWidth / 2;
  },
  arcline: function arcline(cx, cy, r, startAngle, endAngle, clockwise, lineWidth, x, y) {
    return Arc.pointDistance(cx, cy, r, startAngle, endAngle, clockwise, x, y) <= lineWidth / 2;
  },
  rect: function rect(rx, ry, width, height, x, y) {
    return rx <= x && x <= rx + width && ry <= y && y <= ry + height;
  },
  circle: function circle(cx, cy, r, x, y) {
    return Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(r, 2);
  },
  box: function box(minX, maxX, minY, maxY, x, y) {
    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }
};