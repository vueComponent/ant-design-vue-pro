var vec2 = require('../../util/index').vec2;

module.exports = {
  at: function at(p1, p2, t) {
    return (p2 - p1) * t + p1;
  },
  pointDistance: function pointDistance(x1, y1, x2, y2, x, y) {
    var d = [x2 - x1, y2 - y1];

    if (vec2.exactEquals(d, [0, 0])) {
      return NaN;
    }

    var u = [-d[1], d[0]];
    vec2.normalize(u, u);
    var a = [x - x1, y - y1];
    return Math.abs(vec2.dot(a, u));
  },
  box: function box(x1, y1, x2, y2, lineWidth) {
    var halfWidth = lineWidth / 2;
    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var minY = Math.min(y1, y2);
    var maxY = Math.max(y1, y2);
    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
    };
  },
  len: function len(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
};