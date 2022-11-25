const Util = require('../util/index');
const Shape = require('../core/shape');
const Arrow = require('./util/arrow');
const LineMath = require('./math/line');

const Polyline = function(cfg) {
  Polyline.superclass.constructor.call(this, cfg);
};

Polyline.ATTRS = {
  points: null,
  lineWidth: 1,
  startArrow: false,
  endArrow: false,
  tCache: null
};

Util.extend(Polyline, Shape);

Util.augment(Polyline, {
  canStroke: true,
  type: 'polyline',
  tCache: null, // 缓存各点的t
  getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox() {
    const self = this;
    const attrs = self._attrs;
    const lineWidth = this.getHitLineWidth();
    const points = attrs.points;
    if (!points || points.length === 0) {
      return null;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    Util.each(points, function(point) {
      const x = point[0];
      const y = point[1];
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

    const halfWidth = lineWidth / 2;
    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
    };
  },
  _setTcache() {
    const self = this;
    const attrs = self._attrs;
    const points = attrs.points;
    let totalLength = 0;
    let tempLength = 0;
    const tCache = [];
    let segmentT;
    let segmentL;
    if (!points || points.length === 0) {
      return;
    }

    Util.each(points, function(p, i) {
      if (points[i + 1]) {
        totalLength += LineMath.len(p[0], p[1], points[i + 1][0], points[i + 1][1]);
      }
    });
    if (totalLength <= 0) {
      return;
    }
    Util.each(points, function(p, i) {
      if (points[i + 1]) {
        segmentT = [];
        segmentT[0] = tempLength / totalLength;
        segmentL = LineMath.len(p[0], p[1], points[i + 1][0], points[i + 1][1]);
        tempLength += segmentL;
        segmentT[1] = tempLength / totalLength;
        tCache.push(segmentT);
      }
    });
    this.tCache = tCache;
  },
  createPath(context) {
    const self = this;
    const attrs = self._attrs;
    const points = attrs.points;
    let i;

    if (points.length < 2) {
      return;
    }
    const len = points.length - 1;
    let x1 = points[0][0],
      y1 = points[0][1],
      x2 = points[len][0],
      y2 = points[len][1];
    // 如果定义了箭头，并且是自定义箭头，线条相应缩进
    if (attrs.startArrow && attrs.startArrow.d) {
      const dist = Arrow.getShortenOffset(points[0][0], points[0][1], points[1][0], points[1][1], attrs.startArrow.d);
      x1 += dist.dx;
      y1 += dist.dy;
    }
    if (attrs.endArrow && attrs.endArrow.d) {
      const dist = Arrow.getShortenOffset(points[len - 1][0], points[len - 1][1], points[len][0], points[len][1], attrs.endArrow.d);
      x2 -= dist.dx;
      y2 -= dist.dy;
    }
    context = context || self.get('context');
    context.beginPath();

    context.moveTo(x1, y1);
    for (i = 1; i < len; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.lineTo(x2, y2);
  },
  getStartTangent() {
    const points = this.__attrs.points;
    const result = [];
    result.push([ points[1][0], points[1][1] ]);
    result.push([ points[0][0], points[0][1] ]);
    return result;
  },
  getEndTangent() {
    const points = this.__attrs.points;
    const l = points.length - 1;
    const result = [];
    result.push([ points[l - 1][0], points[l - 1][1] ]);
    result.push([ points[l][0], points[l][1] ]);
    return result;
  },
  afterPath(context) {
    const self = this;
    const attrs = self._attrs;
    const points = attrs.points;
    const l = points.length - 1;
    context = context || self.get('context');

    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, points[1][0], points[1][1], points[0][0], points[0][1]);
    }
    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, points[l - 1][0], points[l - 1][1], points[l][0], points[l][1]);
    }
  },
  getPoint(t) {
    const attrs = this._attrs;
    const points = attrs.points;
    let tCache = this.tCache;
    let subt;
    let index;
    if (!tCache) {
      this._setTcache();
      tCache = this.tCache;
    }
    Util.each(tCache, function(v, i) {
      if (t >= v[0] && t <= v[1]) {
        subt = (t - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    return {
      x: LineMath.at(points[index][0], points[index + 1][0], subt),
      y: LineMath.at(points[index][1], points[index + 1][1], subt)
    };
  }
});

module.exports = Polyline;
