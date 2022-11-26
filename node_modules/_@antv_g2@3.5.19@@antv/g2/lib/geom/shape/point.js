/**
 * @fileOverview point shapes
 * @author dxq613@gmail.com
 * @author sima.zhang1990@gmail.com
 * @author huangtonger@aliyun.com
 */
var Util = require('../../util');

var ShapeUtil = require('../util/shape');

var Global = require('../../global');

var Shape = require('./shape'); // const svgpath = require('svgpath');


var _require = require('../../renderer'),
    Marker = _require.Marker;

var PathUtil = Util.PathUtil;
var SHAPES = ['circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down'];
var HOLLOW_SHAPES = ['cross', 'tick', 'plus', 'hyphen', 'line', 'pointerLine', 'pointerArrow'];
var SQRT_3 = Math.sqrt(3); // 增加marker

Util.mix(Marker.Symbols, {
  hexagon: function hexagon(x, y, r) {
    var diffX = r / 2 * SQRT_3;
    return [['M', x, y - r], ['L', x + diffX, y - r / 2], ['L', x + diffX, y + r / 2], ['L', x, y + r], ['L', x - diffX, y + r / 2], ['L', x - diffX, y - r / 2], ['Z']];
  },
  bowtie: function bowtie(x, y, r) {
    var diffY = r - 1.5;
    return [['M', x - r, y - diffY], ['L', x + r, y + diffY], ['L', x + r, y - diffY], ['L', x - r, y + diffY], ['Z']];
  },
  cross: function cross(x, y, r) {
    return [['M', x - r, y - r], ['L', x + r, y + r], ['M', x + r, y - r], ['L', x - r, y + r]];
  },
  tick: function tick(x, y, r) {
    return [['M', x - r / 2, y - r], ['L', x + r / 2, y - r], ['M', x, y - r], ['L', x, y + r], ['M', x - r / 2, y + r], ['L', x + r / 2, y + r]];
  },
  plus: function plus(x, y, r) {
    return [['M', x - r, y], ['L', x + r, y], ['M', x, y - r], ['L', x, y + r]];
  },
  hyphen: function hyphen(x, y, r) {
    return [['M', x - r, y], ['L', x + r, y]];
  },
  line: function line(x, y, r) {
    return [['M', x, y - r], ['L', x, y + r]];
  }
});

function getFillAttrs(cfg) {
  var defaultAttrs = Global.shape.point;
  var pointAttrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addFillAttrs(pointAttrs, cfg);

  if (Util.isNumber(cfg.size)) {
    pointAttrs.radius = cfg.size;
  }

  return pointAttrs;
}

function getLineAttrs(cfg) {
  var defaultAttrs = Global.shape.hollowPoint;
  var pointAttrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addStrokeAttrs(pointAttrs, cfg);

  if (Util.isNumber(cfg.size)) {
    pointAttrs.radius = cfg.size;
  }

  return pointAttrs;
}

var Point = Shape.registerFactory('point', {
  defaultShapeType: 'hollowCircle',
  getActiveCfg: function getActiveCfg(type, cfg) {
    // 点放大 + 颜色加亮
    var radius = cfg.radius;
    var color;

    if (type && (type.indexOf('hollow') === 0 || Util.indexOf(HOLLOW_SHAPES, type) !== -1) || !type) {
      color = cfg.stroke || cfg.strokeStyle;
    } else {
      color = cfg.fill || cfg.fillStyle;
    }

    return {
      radius: radius + 1,
      shadowBlur: radius,
      shadowColor: color,
      stroke: color,
      strokeOpacity: 1,
      lineWidth: 1
    };
  },
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    return ShapeUtil.splitPoints(pointInfo);
  }
});

function getRectPath(cfg) {
  var x = cfg.points[0].x;
  var y = cfg.points[0].y;
  var w = cfg.size[0];
  var h = cfg.size[1];
  var path = [['M', x - 0.5 * w, y - 0.5 * h], ['L', x + 0.5 * w, y - 0.5 * h], ['L', x + 0.5 * w, y + 0.5 * h], ['L', x - 0.5 * w, y + 0.5 * h], ['z']];
  return path;
} // 用于桑基图的节点


Shape.registerShape('point', 'rect', {
  draw: function draw(cfg, container) {
    var rectAttrs = getFillAttrs(cfg);
    var path = getRectPath(cfg);
    path = this.parsePath(path);
    var gShape = container.addShape('path', {
      attrs: Util.mix(rectAttrs, {
        path: path
      })
    });
    return gShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var attrs = getFillAttrs(cfg);
    attrs.symbol = 'rect';
    attrs.radius = 4.5;
    return attrs;
  }
}); // 添加shapes

Util.each(SHAPES, function (shape) {
  Shape.registerShape('point', shape, {
    draw: function draw(cfg, container) {
      // cfg.points = this.parsePoints(cfg.points);
      var attrs = getFillAttrs(cfg);
      return container.addShape('Marker', {
        attrs: Util.mix(attrs, {
          symbol: shape,
          x: cfg.x,
          y: cfg.y
        })
      });
    },
    getMarkerCfg: function getMarkerCfg(cfg) {
      var attrs = getFillAttrs(cfg);
      attrs.symbol = shape;
      attrs.radius = 4.5;
      return attrs;
    }
  }); // 添加该 shape 对应的 hollowShape

  Shape.registerShape('point', 'hollow' + Util.upperFirst(shape), {
    draw: function draw(cfg, container) {
      // cfg.points = this.parsePoints(cfg.points);
      var attrs = getLineAttrs(cfg);
      return container.addShape('Marker', {
        attrs: Util.mix(attrs, {
          symbol: shape,
          x: cfg.x,
          y: cfg.y
        })
      });
    },
    getMarkerCfg: function getMarkerCfg(cfg) {
      var attrs = getLineAttrs(cfg);
      attrs.symbol = shape;
      attrs.radius = 4.5;
      return attrs;
    }
  });
}); // 添加 hollowShapes

Util.each(HOLLOW_SHAPES, function (shape) {
  Shape.registerShape('point', shape, {
    draw: function draw(cfg, container) {
      var attrs = getLineAttrs(cfg);
      return container.addShape('Marker', {
        attrs: Util.mix(attrs, {
          symbol: shape,
          x: cfg.x,
          y: cfg.y
        })
      });
    },
    getMarkerCfg: function getMarkerCfg(cfg) {
      var attrs = getLineAttrs(cfg);
      attrs.symbol = shape;
      attrs.radius = 4.5;
      return attrs;
    }
  });
}); // image

Shape.registerShape('point', 'image', {
  draw: function draw(cfg, container) {
    cfg.points = this.parsePoints(cfg.points);
    return container.addShape('image', {
      attrs: {
        x: cfg.points[0].x - cfg.size / 2,
        y: cfg.points[0].y - cfg.size,
        width: cfg.size,
        height: cfg.size,
        img: cfg.shape[1]
      }
    });
  }
}); // path

var pathMetaCache = {};
Shape.registerShape('point', 'path', {
  draw: function draw(cfg, container) {
    var attrs = Util.mix({}, getLineAttrs(cfg), getFillAttrs(cfg));
    var path = cfg.shape[1];
    var size = cfg.size || 10;
    var pathMeta;

    if (pathMetaCache[path]) {
      pathMeta = pathMetaCache[path];
    } else {
      var segments = PathUtil.parsePathString(path);
      var nums = Util.flatten(segments).filter(function (num) {
        return Util.isNumber(num);
      });
      pathMetaCache[path] = pathMeta = {
        range: Math.max.apply(null, nums) - Math.min.apply(null, nums),
        segments: segments
      };
    }

    var scale = size / pathMeta.range;
    var transform = [];

    if (attrs.rotate) {
      transform.push(['r', attrs.rotate / 180 * Math.PI]);
      delete attrs.rotate;
    }

    var shape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: pathMeta.segments
      })
    });
    transform.push(['s', scale, scale], ['t', cfg.x, cfg.y]);
    shape.transform(transform);
    return shape;
  }
});
module.exports = Point;