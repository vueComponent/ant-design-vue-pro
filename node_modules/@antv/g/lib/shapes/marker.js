var Util = require('../util/index');

var Shape = require('../core/shape');

var Format = require('../util/format');

var PathSegment = require('./util/path-segment');

var Marker = function Marker(cfg) {
  Marker.superclass.constructor.call(this, cfg);
};

Marker.Symbols = {
  // 圆
  circle: function circle(x, y, r) {
    return [['M', x, y], ['m', -r, 0], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0]];
  },
  // 正方形
  square: function square(x, y, r) {
    return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
  },
  // 菱形
  diamond: function diamond(x, y, r) {
    return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
  },
  // 三角形
  triangle: function triangle(x, y, r) {
    var diffY = r * Math.sin(1 / 3 * Math.PI);
    return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['z']];
  },
  // 倒三角形
  'triangle-down': function triangleDown(x, y, r) {
    var diffY = r * Math.sin(1 / 3 * Math.PI);
    return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
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
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this._attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.radius || attrs.r;
    var lineWidth = this.getHitLineWidth();
    var halfWidth = lineWidth / 2 + r;
    return {
      minX: cx - halfWidth,
      minY: cy - halfWidth,
      maxX: cx + halfWidth,
      maxY: cy + halfWidth
    };
  },
  _getPath: function _getPath() {
    var attrs = this._attrs;
    var x = attrs.x;
    var y = attrs.y;
    var r = attrs.radius || attrs.r;
    var symbol = attrs.symbol || 'circle';
    var method;

    if (Util.isFunction(symbol)) {
      method = symbol;
    } else {
      method = Marker.Symbols[symbol];
    }

    if (!method) {
      console.warn(symbol + " marker is not supported.");
      return null;
    }

    return method(x, y, r);
  },
  createPath: function createPath(context) {
    var segments = this._cfg.segments;

    if (segments && !this._cfg.hasUpdate) {
      context.beginPath();

      for (var i = 0; i < segments.length; i++) {
        segments[i].draw(context);
      }

      return;
    }

    var path = Format.parsePath(this._getPath());
    context.beginPath();
    var preSegment;
    segments = [];

    for (var _i = 0; _i < path.length; _i++) {
      var item = path[_i];
      preSegment = new PathSegment(item, preSegment, _i === path.length - 1);
      segments.push(preSegment);
      preSegment.draw(context);
    }

    this._cfg.segments = segments;
    this._cfg.hasUpdate = false;
  }
});
module.exports = Marker;