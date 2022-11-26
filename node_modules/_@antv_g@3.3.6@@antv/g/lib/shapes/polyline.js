var Util = require('../util/index');

var Shape = require('../core/shape');

var Arrow = require('./util/arrow');

var LineMath = require('./math/line');

var Polyline = function Polyline(cfg) {
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
  tCache: null,
  // 缓存各点的t
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self._attrs;
    var lineWidth = this.getHitLineWidth();
    var points = attrs.points;

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
  _setTcache: function _setTcache() {
    var self = this;
    var attrs = self._attrs;
    var points = attrs.points;
    var totalLength = 0;
    var tempLength = 0;
    var tCache = [];
    var segmentT;
    var segmentL;

    if (!points || points.length === 0) {
      return;
    }

    Util.each(points, function (p, i) {
      if (points[i + 1]) {
        totalLength += LineMath.len(p[0], p[1], points[i + 1][0], points[i + 1][1]);
      }
    });

    if (totalLength <= 0) {
      return;
    }

    Util.each(points, function (p, i) {
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
  createPath: function createPath(context) {
    var self = this;
    var attrs = self._attrs;
    var points = attrs.points;
    var l;
    var i;

    if (points.length < 2) {
      return;
    }

    context = context || self.get('context');
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);

    for (i = 1, l = points.length - 1; i < l; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }

    context.lineTo(points[l][0], points[l][1]);
  },
  getStartTangent: function getStartTangent() {
    var points = this.__attrs.points;
    var result = [];
    result.push([points[1][0], points[1][1]]);
    result.push([points[0][0], points[0][1]]);
    return result;
  },
  getEndTangent: function getEndTangent() {
    var points = this.__attrs.points;
    var l = points.length - 1;
    var result = [];
    result.push([points[l - 1][0], points[l - 1][1]]);
    result.push([points[l][0], points[l][1]]);
    return result;
  },
  afterPath: function afterPath(context) {
    var self = this;
    var attrs = self._attrs;
    var points = attrs.points;
    var l = points.length - 1;
    context = context || self.get('context');

    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, points[1][0], points[1][1], points[0][0], points[0][1]);
    }

    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, points[l - 1][0], points[l - 1][1], points[l][0], points[l][1]);
    }
  },
  getPoint: function getPoint(t) {
    var attrs = this._attrs;
    var points = attrs.points;
    var tCache = this.tCache;
    var subt;
    var index;

    if (!tCache) {
      this._setTcache();

      tCache = this.tCache;
    }

    Util.each(tCache, function (v, i) {
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