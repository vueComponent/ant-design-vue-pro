/**
 * @fileOverview interval shapes
 * @author dxq613@gmail.com
 * @author sima.zhang1990@gmail.com
 * @author huangtonger@aliyun.com
 */
var Util = require('../../util');

var Shape = require('./shape');

var PathUtil = require('../util/path');

var ShapeUtil = require('../util/shape');

var Global = require('../../global');

var G = require('../../renderer');

var GPathUtil = Util.PathUtil; // 获取柱状图的几个点

function getRectPoints(cfg, isPyramid) {
  var x = cfg.x;
  var y = cfg.y;
  var y0 = cfg.y0; // 0 点的位置

  var width = cfg.size; // 有3种情况，
  // 1. y，x都不是数组
  // 2. y是数组，x不是
  // 3. x是数组，y不是

  var ymin = y0;
  var ymax = y;

  if (Util.isArray(y)) {
    ymax = y[1];
    ymin = y[0];
  }

  var xmin;
  var xmax;

  if (Util.isArray(x)) {
    xmin = x[0];
    xmax = x[1];
  } else {
    xmin = x - width / 2;
    xmax = x + width / 2;
  }

  var points = [];
  points.push({
    x: xmin,
    y: ymin
  }, {
    x: xmin,
    y: ymax
  });

  if (isPyramid) {
    points.push({
      x: xmax,
      y: (ymax + ymin) / 2
    });
  } else {
    points.push({
      x: xmax,
      y: ymax
    }, {
      x: xmax,
      y: ymin
    });
  }

  return points;
}

function getRectPath(points) {
  var path = [];

  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    if (point) {
      var action = i === 0 ? 'M' : 'L';
      path.push([action, point.x, point.y]);
    }
  }

  var first = points[0];
  path.push(['L', first.x, first.y]);
  path.push(['z']);
  return path;
}

function getLinePoints(cfg) {
  var x = cfg.x;
  var y = cfg.y;
  var y0 = cfg.y0; // 0 点的位置

  var points = [];

  if (Util.isArray(y)) {
    Util.each(y, function (yItem, idx) {
      points.push({
        x: Util.isArray(x) ? x[idx] : x,
        y: yItem
      });
    });
  } else {
    points.push({
      x: x,
      y: y
    }, {
      x: x,
      y: y0
    });
  }

  return points;
}

function getTickPoints(cfg) {
  var x = cfg.x;
  var y = Util.isArray(cfg.y) ? cfg.y[1] : cfg.y;
  var y0 = Util.isArray(cfg.y) ? cfg.y[0] : cfg.y0;
  var barWidth = cfg.size;
  var points = [];
  points.push({
    x: x - barWidth / 2,
    y: y
  }, {
    x: x + barWidth / 2,
    y: y
  }, {
    x: x,
    y: y
  }, {
    x: x,
    y: y0
  }, {
    x: x - barWidth / 2,
    y: y0
  }, {
    x: x + barWidth / 2,
    y: y0
  });
  return points;
}

function getTickPath(points) {
  var path = [];
  path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['M', points[4].x, points[4].y], ['L', points[5].x, points[5].y]);
  return path;
}

function getFillAttrs(cfg) {
  var defaultAttrs = Global.shape.interval;
  var attrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addFillAttrs(attrs, cfg);

  if (cfg.color) {
    attrs.stroke = attrs.stroke || cfg.color;
  }

  return attrs;
}

function getLineAttrs(cfg) {
  var defaultAttrs = Global.shape.hollowInterval;
  var attrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addStrokeAttrs(attrs, cfg);
  return attrs;
}

function getFunnelPath(cfg, isFunnel) {
  var path = [];
  var points = cfg.points;
  var nextPoints = cfg.nextPoints;

  if (!Util.isNil(nextPoints)) {
    path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', nextPoints[1].x, nextPoints[1].y], ['L', nextPoints[0].x, nextPoints[0].y], ['Z']);
  } else if (isFunnel) {
    path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['Z']);
  } else {
    path.push(['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['L', points[2].x, points[2].y], ['Z']);
  }

  return path;
}

function getThetaCfg(point, coord) {
  var r = coord.getRadius();
  var inner = coord.innerRadius;
  var startAngle;
  var endAngle;
  var ir = r * inner;
  var startPoint;
  var endPoint;

  if (!Util.isArray(point.x) && Util.isArray(point.y)) {
    point.x = [point.x, point.x]; // 如果x是一个值，y是数组，将x转成数组
  }

  if (Util.isArray(point.x)) {
    startPoint = {
      x: point.x[0],
      y: point.y[0]
    };
    endPoint = {
      x: point.x[1],
      y: point.y[1]
    };
    startAngle = PathUtil.getPointAngle(coord, startPoint);
    endAngle = PathUtil.getPointAngle(coord, endPoint);

    if (endAngle <= startAngle) {
      // 考虑占比百分百的情形
      endAngle = endAngle + Math.PI * 2;
    }
  } else {
    endPoint = point;
    startAngle = coord.startAngle;
    endAngle = PathUtil.getPointAngle(coord, endPoint);
  }

  return {
    r: r,
    ir: ir,
    startAngle: startAngle,
    endAngle: endAngle
  };
} // 获取选中时的样式，当前仅支持饼图


function _getSelectedCfg(type, cfg) {
  var geom = cfg.geom;
  var coord = geom.get('coord');
  var point = cfg.point;
  var r = 7.5;
  var selectedCfg;

  if (coord && coord.type === 'theta') {
    var thetaCfg = getThetaCfg(point, coord);
    var middleAngle = (thetaCfg.endAngle - thetaCfg.startAngle) / 2 + thetaCfg.startAngle;
    var x = r * Math.cos(middleAngle);
    var y = r * Math.sin(middleAngle);
    selectedCfg = {
      transform: [['t', x, y]]
    };
  }

  return Util.mix({}, selectedCfg);
}

var Interval = Shape.registerFactory('interval', {
  defaultShapeType: 'rect',
  getActiveCfg: function getActiveCfg(type, cfg) {
    if (!type || Util.inArray(['rect', 'funnel', 'pyramid'], type)) {
      // 透明度降低 0.15
      var fillOpacity = cfg.fillOpacity || cfg.opacity || 1;
      return {
        fillOpacity: fillOpacity - 0.15
      };
    }

    var lineWidth = cfg.lineWidth || 0;
    return {
      lineWidth: lineWidth + 1
    };
  },
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    return getRectPoints(pointInfo);
  },
  getSelectedCfg: function getSelectedCfg(type, cfg) {
    return _getSelectedCfg(type, cfg);
  }
}); // 默认柱状图

Shape.registerShape('interval', 'rect', {
  draw: function draw(cfg, container) {
    var attrs = getFillAttrs(cfg);
    var path = getRectPath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var rectCfg = getFillAttrs(cfg);
    var isInCircle = cfg.isInCircle;
    return Util.mix({
      symbol: isInCircle ? 'circle' : 'square',
      radius: isInCircle ? 4.5 : 4
    }, rectCfg);
  }
}); // 空心柱状图

Shape.registerShape('interval', 'hollowRect', {
  draw: function draw(cfg, container) {
    var attrs = getLineAttrs(cfg);
    var path = getRectPath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var rectCfg = getLineAttrs(cfg);
    var isInCircle = cfg.isInCircle;
    return Util.mix({
      symbol: isInCircle ? 'circle' : 'square',
      radius: isInCircle ? 4.5 : 4
    }, rectCfg);
  }
}); // 线形柱状图

Shape.registerShape('interval', 'line', {
  getPoints: function getPoints(pointInfo) {
    return getLinePoints(pointInfo);
  },
  draw: function draw(cfg, container) {
    var attrs = getLineAttrs(cfg);
    attrs.lineWidth = cfg.size || 1; // size 就是线的宽度

    var path = getRectPath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var lineCfg = getLineAttrs(cfg);
    return Util.mix({
      symbol: 'line',
      radius: 5
    }, lineCfg);
  }
}); // 钉子形的柱状图

Shape.registerShape('interval', 'tick', {
  getPoints: function getPoints(pointInfo) {
    return getTickPoints(pointInfo);
  },
  draw: function draw(cfg, container) {
    var attrs = getLineAttrs(cfg); // @2018-12-25 by blue.lb 经过测试发现size代表的是宽度，而style中的lineWidth才是设置线宽，放在interval暂时先特殊处理

    if (!attrs.lineWidth) {
      attrs.lineWidth = 2;
    }

    var path = getTickPath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var lineCfg = getLineAttrs(cfg);
    return Util.mix({
      symbol: 'tick',
      radius: 5
    }, lineCfg);
  }
}); // 漏斗图

Shape.registerShape('interval', 'funnel', {
  getPoints: function getPoints(pointInfo) {
    pointInfo.size = pointInfo.size * 2; // 漏斗图的 size 是柱状图的两倍

    return getRectPoints(pointInfo);
  },
  draw: function draw(cfg, container) {
    var attrs = getFillAttrs(cfg);
    var path = getFunnelPath(cfg, true);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var funnelCfg = getFillAttrs(cfg);
    return Util.mix({
      symbol: 'square',
      radius: 4
    }, funnelCfg);
  }
}); // 金字塔图

Shape.registerShape('interval', 'pyramid', {
  getPoints: function getPoints(pointInfo) {
    pointInfo.size = pointInfo.size * 2; // 漏斗图的 size 是柱状图的两倍

    return getRectPoints(pointInfo, true);
  },
  draw: function draw(cfg, container) {
    var attrs = getFillAttrs(cfg);
    var path = getFunnelPath(cfg, false);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var funnelCfg = getFillAttrs(cfg);
    return Util.mix({
      symbol: 'square',
      radius: 4
    }, funnelCfg);
  }
}); // 水波图

/**
 * 用贝塞尔曲线模拟正弦波
 * Using Bezier curves to fit sine wave.
 * There is 4 control points for each curve of wave,
 * which is at 1/4 wave length of the sine wave.
 *
 * The control points for a wave from (a) to (d) are a-b-c-d:
 *          c *----* d
 *     b *
 *       |
 * ... a * ..................
 *
 * whose positions are a: (0, 0), b: (0.5, 0.5), c: (1, 1), d: (PI / 2, 1)
 *
 * @param {number} x          x position of the left-most point (a)
 * @param {number} stage      0-3, stating which part of the wave it is
 * @param {number} waveLength wave length of the sine wave
 * @param {number} amplitude  wave amplitude
 * @return {Array} 正弦片段曲线
 */

function getWaterWavePositions(x, stage, waveLength, amplitude) {
  if (stage === 0) {
    return [[x + 1 / 2 * waveLength / Math.PI / 2, amplitude / 2], [x + 1 / 2 * waveLength / Math.PI, amplitude], [x + waveLength / 4, amplitude]];
  } else if (stage === 1) {
    return [[x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2), amplitude], [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1), amplitude / 2], [x + waveLength / 4, 0]];
  } else if (stage === 2) {
    return [[x + 1 / 2 * waveLength / Math.PI / 2, -amplitude / 2], [x + 1 / 2 * waveLength / Math.PI, -amplitude], [x + waveLength / 4, -amplitude]];
  }

  return [[x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2), -amplitude], [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1), -amplitude / 2], [x + waveLength / 4, 0]];
}
/**
 * 获取水波路径
 * @param  {number} radius          半径
 * @param  {number} waterLevel      水位
 * @param  {number} waveLength      波长
 * @param  {number} phase           相位
 * @param  {number} amplitude       震幅
 * @param  {number} cx              圆心x
 * @param  {number} cy              圆心y
 * @return {Array}  path            路径
 * @reference http://gitlab.alipay-inc.com/datavis/g6/blob/1.2.0/src/graph/utils/path.js#L135
 */


function getWaterWavePath(radius, waterLevel, waveLength, phase, amplitude, cx, cy) {
  var curves = Math.ceil(2 * radius / waveLength * 4) * 2;
  var path = []; // map phase to [-Math.PI * 2, 0]

  while (phase < -Math.PI * 2) {
    phase += Math.PI * 2;
  }

  while (phase > 0) {
    phase -= Math.PI * 2;
  }

  phase = phase / Math.PI / 2 * waveLength;
  var left = cx - radius + phase - radius * 2;
  /**
   * top-left corner as start point
   *
   * draws this point
   *  |
   * \|/
   *  ~~~~~~~~
   *  |      |
   *  +------+
   */

  path.push(['M', left, waterLevel]);
  /**
   * top wave
   *
   * ~~~~~~~~ <- draws this sine wave
   * |      |
   * +------+
   */

  var waveRight = 0;

  for (var c = 0; c < curves; ++c) {
    var stage = c % 4;
    var pos = getWaterWavePositions(c * waveLength / 4, stage, waveLength, amplitude);
    path.push(['C', pos[0][0] + left, -pos[0][1] + waterLevel, pos[1][0] + left, -pos[1][1] + waterLevel, pos[2][0] + left, -pos[2][1] + waterLevel]);

    if (c === curves - 1) {
      waveRight = pos[2][0];
    }
  }
  /**
   * top-right corner
   *
   *                       ~~~~~~~~
   * 3. draws this line -> |      | <- 1. draws this line
   *                       +------+
   *                          ^
   *                          |
   *                  2. draws this line
   */


  path.push(['L', waveRight + left, cy + radius]);
  path.push(['L', left, cy + radius]);
  path.push(['L', left, waterLevel]);
  return path;
}
/**
 * 添加水波
 * @param {number} x           中心x
 * @param {number} y           中心y
 * @param {number} level       水位等级 0～1
 * @param {number} waveCount   水波数
 * @param {number} colors      色值
 * @param {number} group       图组
 * @param {number} clip        用于剪切的图形
 * @param {number} radius      绘制图形的高度
 */


function addWaterWave(x, y, level, waveCount, colors, group, clip, radius) {
  var bbox = clip.getBBox();
  var width = bbox.maxX - bbox.minX;
  var height = bbox.maxY - bbox.minY;
  var duration = 5000;
  var delayDiff = 300;

  for (var i = 0; i < waveCount; i++) {
    var wave = group.addShape('path', {
      attrs: {
        path: getWaterWavePath(radius, bbox.minY + height * level, width / 4, 0, width / 64, x, y),
        fill: colors[i],
        clip: clip
      }
    }); // FIXME wave animation error in svg

    if (Global.renderer === 'canvas') {
      wave.animate({
        transform: [['t', width / 2, 0]],
        repeat: true
      }, duration - i * delayDiff);
    }
  }
}

Shape.registerShape('interval', 'liquid-fill-gauge', {
  draw: function draw(cfg, container) {
    var self = this;
    var cy = 0.5;
    var sumX = 0;
    var minX = Infinity;
    Util.each(cfg.points, function (p) {
      if (p.x < minX) {
        minX = p.x;
      }

      sumX += p.x;
    });
    var cx = sumX / cfg.points.length;
    var cp = self.parsePoint({
      x: cx,
      y: cy
    });
    var minP = self.parsePoint({
      x: minX,
      y: 0.5
    });
    var xWidth = cp.x - minP.x;
    var radius = Math.min(xWidth, minP.y);
    var attrs = getFillAttrs(cfg);
    var clipCircle = new G.Circle({
      attrs: {
        x: cp.x,
        y: cp.y,
        r: radius
      }
    });
    addWaterWave(cp.x, cp.y, cfg.y / (2 * cp.y), 1, [attrs.fill], container, clipCircle, radius * 4);
    return container.addShape('circle', {
      attrs: Util.mix(getLineAttrs(cfg), {
        x: cp.x,
        y: cp.y,
        r: radius + radius / 8
      })
    });
  }
});
var pathMetaCache = {};
Shape.registerShape('interval', 'liquid-fill-path', {
  draw: function draw(cfg, container) {
    var self = this;
    var attrs = Util.mix({}, getFillAttrs(cfg));
    var path = cfg.shape[1];
    var cy = 0.5;
    var sumX = 0;
    var minX = Infinity;
    Util.each(cfg.points, function (p) {
      if (p.x < minX) {
        minX = p.x;
      }

      sumX += p.x;
    });
    var cx = sumX / cfg.points.length;
    var cp = self.parsePoint({
      x: cx,
      y: cy
    });
    var minP = self.parsePoint({
      x: minX,
      y: 0.5
    });
    var xWidth = cp.x - minP.x;
    var radius = Math.min(xWidth, minP.y);
    var pathMeta;

    if (pathMetaCache[path]) {
      pathMeta = pathMetaCache[path];
    } else {
      var segments = GPathUtil.parsePathString(path);
      pathMetaCache[path] = pathMeta = {
        segments: segments
      };
    }

    var transform = [];

    if (attrs.rotate) {
      transform.push(['r', attrs.rotate / 180 * Math.PI]);
      delete attrs.rotate;
    }

    var shape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        fillOpacity: 0,
        path: pathMeta.segments
      })
    });
    var bbox = Util.cloneDeep(shape.getBBox());
    var rangeX = bbox.maxX - bbox.minX;
    var rangeY = bbox.maxY - bbox.minY;
    var range = Math.max(rangeX, rangeY);
    var scale = radius * 2 / range;
    shape.transform(transform.concat([['s', scale, scale]]));
    var dw = scale * rangeX / 2; // (bbox.maxX - bbox.minX) / 2;

    var dh = scale * rangeY / 2; // (bbox.maxY - bbox.minY) / 2;

    shape.transform([['t', cp.x - dw, cp.y - dh]]);
    addWaterWave(cp.x, cp.y, cfg.y / (2 * cp.y), 1, [attrs.fill], container, shape, minP.y * 4);
    var keyShape = container.addShape('path', {
      attrs: Util.mix(getLineAttrs(cfg), {
        path: pathMeta.segments
      })
    });
    keyShape.transform(transform.concat([['s', scale, scale], ['t', cp.x - dw, cp.y - dh]]));
    return keyShape;
  }
});
Shape.registerShape('interval', 'top-line', {
  draw: function draw(cfg, container) {
    var attrs = getFillAttrs(cfg);
    var style = cfg.style || {};
    var linePath = [['M', cfg.points[1].x, cfg.points[1].y], ['L', cfg.points[2].x, cfg.points[2].y]];
    var lineAttrs = {
      stroke: style.stroke || 'white',
      lineWidth: style.lineWidth || 1,
      path: this.parsePath(linePath)
    };
    var path = getRectPath(cfg.points);
    path = this.parsePath(path);
    delete attrs.stroke; // 不在柱子上绘制线

    var rectShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        zIndex: 0,
        path: path
      })
    });
    container.addShape('path', {
      zIndex: 1,
      attrs: lineAttrs
    });
    return rectShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var rectCfg = getFillAttrs(cfg);
    var isInCircle = cfg.isInCircle;
    return Util.mix({
      symbol: isInCircle ? 'circle' : 'square',
      radius: isInCircle ? 4.5 : 4
    }, rectCfg);
  }
});
module.exports = Interval;