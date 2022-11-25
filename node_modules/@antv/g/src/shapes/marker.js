const Util = require('../util/index');
const Shape = require('../core/shape');
const Format = require('../util/format');
const PathSegment = require('./util/path-segment');

const Marker = function(cfg) {
  Marker.superclass.constructor.call(this, cfg);
};

Marker.Symbols = {
  // 圆
  circle(x, y, r) {
    return [
      [ 'M', x, y ],
      [ 'm', -r, 0 ],
      [ 'a', r, r, 0, 1, 0, r * 2, 0 ],
      [ 'a', r, r, 0, 1, 0, -r * 2, 0 ]
    ];
  },
  // 正方形
  square(x, y, r) {
    return [
      [ 'M', x - r, y - r ],
      [ 'L', x + r, y - r ],
      [ 'L', x + r, y + r ],
      [ 'L', x - r, y + r ],
      [ 'Z' ]
    ];
  },
  // 菱形
  diamond(x, y, r) {
    return [
      [ 'M', x - r, y ],
      [ 'L', x, y - r ],
      [ 'L', x + r, y ],
      [ 'L', x, y + r ],
      [ 'Z' ]
    ];
  },
  // 三角形
  triangle(x, y, r) {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [
      [ 'M', x - r, y + diffY ],
      [ 'L', x, y - diffY ],
      [ 'L', x + r, y + diffY ],
      [ 'z' ]
    ];
  },
  // 倒三角形
  'triangle-down': function(x, y, r) {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [
      [ 'M', x - r, y - diffY ],
      [ 'L', x + r, y - diffY ],
      [ 'L', x, y + diffY ],
      [ 'Z' ]
    ];
  }
};

Marker.ATTRS = {
  path: null,
  lineWidth: 1
};

Util.extend(Marker, Shape);

Util.augment(Marker, {
  type: 'marker',
  canFill: true,
  canStroke: true,
  getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      lineWidth: 1
    };
  },
  calculateBox() {
    const attrs = this._attrs;
    const cx = attrs.x;
    const cy = attrs.y;
    const r = attrs.radius || attrs.r;
    const lineWidth = this.getHitLineWidth();
    const halfWidth = lineWidth / 2 + r;
    return {
      minX: cx - halfWidth,
      minY: cy - halfWidth,
      maxX: cx + halfWidth,
      maxY: cy + halfWidth
    };
  },
  _getPath() {
    const attrs = this._attrs;
    const x = attrs.x;
    const y = attrs.y;
    const r = attrs.radius || attrs.r;
    const symbol = attrs.symbol || 'circle';
    let method;
    if (Util.isFunction(symbol)) {
      method = symbol;
    } else {
      method = Marker.Symbols[symbol];
    }

    if (!method) {
      console.warn(`${symbol} marker is not supported.`);
      return null;
    }

    return method(x, y, r);
  },
  createPath(context) {
    let segments = this._cfg.segments;
    if (segments && !this._cfg.hasUpdate) {
      context.beginPath();
      for (let i = 0; i < segments.length; i++) {
        segments[i].draw(context);
      }
      return;
    }

    const path = Format.parsePath(this._getPath());
    context.beginPath();
    let preSegment;
    segments = [];
    for (let i = 0; i < path.length; i++) {
      const item = path[i];
      preSegment = new PathSegment(item, preSegment, i === path.length - 1);
      segments.push(preSegment);
      preSegment.draw(context);
    }
    this._cfg.segments = segments;
    this._cfg.hasUpdate = false;
  }
});

module.exports = Marker;
