const Util = require('../util/index');
const Shape = require('../core/shape');
const PathSegment = require('./util/path-segment');
const Format = require('../util/format');
const Arrow = require('./util/arrow');
const PathUtil = require('../util/path');
const CubicMath = require('./math/cubic');

const Path = function(cfg) {
  Path.superclass.constructor.call(this, cfg);
};

Path.ATTRS = {
  path: null,
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Path, Shape);

Util.augment(Path, {
  canFill: true,
  canStroke: true,
  type: 'path',
  getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  _afterSetAttrPath(path) {
    const self = this;
    if (Util.isNil(path)) {
      self.setSilent('segments', null);
      self.setSilent('box', undefined);
      return;
    }
    const pathArray = Format.parsePath(path);
    let preSegment;
    const segments = [];

    if (!Util.isArray(pathArray) ||
      pathArray.length === 0 ||
      (pathArray[0][0] !== 'M' &&
        pathArray[0][0] !== 'm')
    ) {
      return;
    }
    const count = pathArray.length;
    for (let i = 0; i < pathArray.length; i++) {
      const item = pathArray[i];
      preSegment = new PathSegment(item, preSegment, i === count - 1);
      segments.push(preSegment);
    }
    self.setSilent('segments', segments);
    self.setSilent('tCache', null);
    self.setSilent('totalLength', null);
    self.setSilent('box', null);
  },
  calculateBox() {
    const self = this;
    const segments = self.get('segments');

    if (!segments) {
      return null;
    }
    const lineWidth = this.getHitLineWidth();
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    Util.each(segments, function(segment) {
      segment.getBBox(lineWidth);
      const box = segment.box;
      if (box) {
        if (box.minX < minX) {
          minX = box.minX;
        }

        if (box.maxX > maxX) {
          maxX = box.maxX;
        }

        if (box.minY < minY) {
          minY = box.minY;
        }

        if (box.maxY > maxY) {
          maxY = box.maxY;
        }
      }
    });
    if (minX === Infinity || minY === Infinity) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
      };
    }
    return {
      minX,
      minY,
      maxX,
      maxY
    };
  },
  _setTcache() {
    let totalLength = 0;
    let tempLength = 0;
    const tCache = [];
    let segmentT;
    let segmentL;
    let segmentN;
    let l;
    const curve = this._cfg.curve;

    if (!curve) {
      return;
    }

    Util.each(curve, function(segment, i) {
      segmentN = curve[i + 1];
      l = segment.length;
      if (segmentN) {
        totalLength += CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
      }
    });
    this._cfg.totalLength = totalLength;

    if (totalLength === 0) {
      this._cfg.tCache = [];
      return;
    }

    Util.each(curve, function(segment, i) {
      segmentN = curve[i + 1];
      l = segment.length;
      if (segmentN) {
        segmentT = [];
        segmentT[0] = tempLength / totalLength;
        segmentL = CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
        tempLength += segmentL;
        segmentT[1] = tempLength / totalLength;
        tCache.push(segmentT);
      }
    });

    this._cfg.tCache = tCache;
  },
  getTotalLength() {
    const totalLength = this.get('totalLength');
    if (!Util.isNil(totalLength)) {
      return totalLength;
    }
    this._calculateCurve();
    this._setTcache();
    return this.get('totalLength');
  },
  _calculateCurve() {
    const self = this;
    const attrs = self._attrs;
    const path = attrs.path;
    this._cfg.curve = PathUtil.pathTocurve(path);
  },
  getStartTangent() {
    const segments = this.get('segments');
    let startPoint,
      endPoint,
      tangent,
      result;
    if (segments.length > 1) {
      startPoint = segments[0].endPoint;
      endPoint = segments[1].endPoint;
      tangent = segments[1].startTangent;
      result = [];
      if (Util.isFunction(tangent)) {
        const v = tangent();
        result.push([ startPoint.x - v[0], startPoint.y - v[1] ]);
        result.push([ startPoint.x, startPoint.y ]);
      } else {
        result.push([ endPoint.x, endPoint.y ]);
        result.push([ startPoint.x, startPoint.y ]);
      }
    }
    return result;
  },
  getEndTangent() {
    const segments = this.get('segments');
    const segmentsLen = segments.length;
    let startPoint,
      endPoint,
      tangent,
      result;
    if (segmentsLen > 1) {
      startPoint = segments[ segmentsLen - 2 ].endPoint;
      endPoint = segments[ segmentsLen - 1 ].endPoint;
      tangent = segments[segmentsLen - 1].endTangent;
      result = [];
      if (Util.isFunction(tangent)) {
        const v = tangent();
        result.push([ endPoint.x - v[0], endPoint.y - v[1] ]);
        result.push([ endPoint.x, endPoint.y ]);
      } else {
        result.push([ startPoint.x, startPoint.y ]);
        result.push([ endPoint.x, endPoint.y ]);
      }
    }
    return result;
  },
  getPoint(t) {
    let tCache = this._cfg.tCache;
    let subt;
    let index;

    if (!tCache) {
      this._calculateCurve();
      this._setTcache();
      tCache = this._cfg.tCache;
    }

    const curve = this._cfg.curve;

    if (!tCache || tCache.length === 0) {
      if (curve) {
        return {
          x: curve[0][1],
          y: curve[0][2]
        };
      }
      return null;
    }
    Util.each(tCache, function(v, i) {
      if (t >= v[0] && t <= v[1]) {
        subt = (t - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    const seg = curve[index];
    if (Util.isNil(seg) || Util.isNil(index)) {
      return null;
    }
    const l = seg.length;
    const nextSeg = curve[index + 1];
    return {
      x: CubicMath.at(seg[l - 2], nextSeg[1], nextSeg[3], nextSeg[5], 1 - subt),
      y: CubicMath.at(seg[l - 1], nextSeg[2], nextSeg[4], nextSeg[6], 1 - subt)
    };
  },
  createPath(context) {
    const self = this;
    const attrs = self._attrs;
    const segments = self.get('segments');
    if (!Util.isArray(segments)) {
      return;
    }

    const segmentsLen = segments.length;
    if (segmentsLen === 0) {
      return;
    }
    context = context || self.get('context');
    context.beginPath();
    if (attrs.startArrow && attrs.startArrow.d) {
      // 如果 startArrow 需要做偏移，为了保证 path 长度一定，需要向内缩进一定距离
      // 如果直接修改 PathSegment 的 params 会导致画布每重绘一次线条便缩短一截
      // 所以在绘制时计算要缩进的距离，直接绘制出来
      const tangent = self.getStartTangent();
      const dist = Arrow.getShortenOffset(tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1], attrs.startArrow.d);
      segments[0].shortenDraw(context, dist.dx, dist.dy);
    } else {
      segments[0].draw(context);
    }
    for (let i = 1; i < segmentsLen - 2; i++) {
      segments[i].draw(context);
    }
    if (attrs.endArrow && attrs.endArrow.d) {
      // 如果 endArrow 需要做偏移，跟 startArrow 一样处理
      // 为了防止结尾为 'Z' 的 segment 缩短不起效，需要取最后两个 segment 特殊处理
      const tangent = self.getEndTangent();
      const dist = Arrow.getShortenOffset(tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1], attrs.endArrow.d);
      const segment = segments[segmentsLen - 1];
      if (segment.command.toUpperCase() === 'Z') {
        if (segments[segmentsLen - 2]) {
          segments[segmentsLen - 2].shortenDraw(context, dist.dx, dist.dy);
        }
        segment.draw(context);
      } else {
        if (segmentsLen > 2) {
          segments[segmentsLen - 2].draw(context);
        }
        segment.shortenDraw(context, dist.dx, dist.dy);
      }
    } else {
      if (segments[segmentsLen - 2]) {
        segments[segmentsLen - 2].draw(context);
      }
      segments[segmentsLen - 1].draw(context);
    }
  },
  afterPath(context) {
    const self = this;
    const attrs = self._attrs;
    const segments = self.get('segments');
    const path = attrs.path;
    context = context || self.get('context');
    if (!Util.isArray(segments)) {
      return;
    }
    if (segments.length === 1) {
      return;
    }
    if (!attrs.startArrow && !attrs.endArrow) {
      return;
    }
    if (path[path.length - 1] === 'z' || path[path.length - 1] === 'Z' || attrs.fill) { // 闭合路径不绘制箭头
      return;
    }
    const startPoints = self.getStartTangent();
    Arrow.addStartArrow(context, attrs, startPoints[0][0], startPoints[0][1], startPoints[1][0], startPoints[1][1]);

    const endPoints = self.getEndTangent();
    Arrow.addEndArrow(context, attrs, endPoints[0][0], endPoints[0][1], endPoints[1][0], endPoints[1][1]);
  }
});

module.exports = Path;
