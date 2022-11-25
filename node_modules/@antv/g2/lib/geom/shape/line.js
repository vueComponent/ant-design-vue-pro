/**
 * @fileOverview line shapes
 * @author dxq613@gmail.com
 * @author sima.zhang1990@gmail.com
 * @author huangtonger@aliyun.com
 */
var Util = require('../../util');

var PathUtil = require('../util/path');

var ShapeUtil = require('../util/shape');

var Shape = require('./shape');

var Global = require('../../global');

var DOT_ARR = [1, 1];
var DASH_ARR = [5.5, 1];

function getAttrs(cfg) {
  var defaultCfg = Global.shape.line;
  var lineAttrs = Util.mix({}, defaultCfg, cfg.style);
  ShapeUtil.addStrokeAttrs(lineAttrs, cfg);

  if (cfg.size) {
    lineAttrs.lineWidth = cfg.size;
  }

  return lineAttrs;
}

function getMarkerAttrs(cfg) {
  var defaultCfg = Global.shape.line;
  var lineAttrs = Util.mix({
    lineWidth: 2,
    radius: 6
  }, defaultCfg, cfg.style);
  ShapeUtil.addStrokeAttrs(lineAttrs, cfg);
  return lineAttrs;
} // 获取带有上下区间的 path


function getRangePath(points, smooth, isInCircle, cfg) {
  var topPoints = [];
  var isStack = cfg.isStack;
  var bottomPoints = [];

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var tmp = ShapeUtil.splitPoints(point);
    bottomPoints.push(tmp[0]);
    topPoints.push(tmp[1]);
  }

  var topPath = getSinglePath(topPoints, smooth, isInCircle, cfg);
  var bottomPath = getSinglePath(bottomPoints, smooth, isInCircle, cfg);

  if (isStack) {
    return topPath;
  }

  return topPath.concat(bottomPath);
} // 单条 path


function getSinglePath(points, smooth, isInCircle, cfg) {
  var path;

  if (!smooth) {
    path = PathUtil.getLinePath(points, false);

    if (isInCircle) {
      path.push(['Z']);
    }
  } else {
    // 直角坐标系下绘制曲线时限制最大值、最小值
    var constraint = cfg.constraint;

    if (isInCircle && points.length) {
      points.push({
        x: points[0].x,
        y: points[0].y
      });
    }

    path = PathUtil.getSplinePath(points, false, constraint);
  }

  return path;
} // get line path


function getPath(cfg, smooth) {
  var path;
  var points = cfg.points;
  var isInCircle = cfg.isInCircle;
  var first = points[0];

  if (Util.isArray(first.y)) {
    path = getRangePath(points, smooth, isInCircle, cfg);
  } else {
    path = getSinglePath(points, smooth, isInCircle, cfg);
  }

  return path;
}

function _interpPoints(points, fn) {
  var tmpPoints = [];
  Util.each(points, function (point, index) {
    var nextPoint = points[index + 1];
    tmpPoints.push(point);

    if (nextPoint) {
      tmpPoints = tmpPoints.concat(fn(point, nextPoint));
    }
  });
  return tmpPoints;
} // 插值的图形path，不考虑null


function _getInterPath(points) {
  var path = [];
  Util.each(points, function (point, index) {
    var subPath = index === 0 ? ['M', point.x, point.y] : ['L', point.x, point.y];
    path.push(subPath);
  });
  return path;
} // 插值的图形


function _getInterPointShapeCfg(cfg, fn) {
  var points = _interpPoints(cfg.points, fn);

  return _getInterPath(points);
}

function _markerFn(x, y, r) {
  return [['M', x - r, y], ['L', x + r, y]];
}

function _smoothMarkerFn(x, y, r) {
  return [['M', x - r, y], ['A', r / 2, r / 2, 0, 1, 1, x, y], ['A', r / 2, r / 2, 0, 1, 0, x + r, y]];
} // get marker cfg


function _getMarkerCfg(cfg, smooth) {
  return Util.mix({
    symbol: smooth ? _smoothMarkerFn : _markerFn
  }, getMarkerAttrs(cfg));
}

function _getInterMarkerCfg(cfg, fn) {
  return Util.mix({
    symbol: fn
  }, getMarkerAttrs(cfg));
} // 当只有一个数据时绘制点


function drawPointShape(shapeObj, cfg, container) {
  var point = cfg.points[0];
  return container.addShape('circle', {
    attrs: Util.mix({
      x: point.x,
      y: point.y,
      r: 2,
      fill: cfg.color
    }, cfg.style)
  });
} // regist line geom


var Line = Shape.registerFactory('line', {
  // 默认的shape
  defaultShapeType: 'line',

  /* getMarkerCfg(type, cfg) {
    const lineObj = Line[type] || Line.line;
    return lineObj.getMarkerCfg(cfg);
  }, */
  getActiveCfg: function getActiveCfg(type, cfg) {
    var lineWidth = cfg.lineWidth || 0;
    return {
      lineWidth: lineWidth + 1
    };
  },
  // 计算点 如果存在多个点，分割成单个的点, 不考虑多个x对应一个y的情况
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    return ShapeUtil.splitPoints(pointInfo);
  },
  drawShape: function drawShape(type, cfg, container) {
    var shape = this.getShape(type);
    var gShape;

    if (cfg.points.length === 1 && Global.showSinglePoint) {
      gShape = drawPointShape(this, cfg, container);
    } else {
      gShape = shape.draw(cfg, container);
    }

    if (gShape) {
      gShape.set('origin', cfg.origin);
      gShape._id = cfg.splitedIndex ? cfg._id + cfg.splitedIndex : cfg._id;
      gShape.name = this.name;
    }

    return gShape;
  }
}); // draw line shape

Shape.registerShape('line', 'line', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getPath(cfg, false);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getMarkerCfg(cfg);
  }
}); // 点线 ···

Shape.registerShape('line', 'dot', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getPath(cfg, false);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path,
        lineDash: DOT_ARR
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var tmp = _getMarkerCfg(cfg, false);

    tmp.lineDash = DOT_ARR;
    return tmp;
  }
}); // 断线 - - -

Shape.registerShape('line', 'dash', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getPath(cfg, false);
    return container.addShape('path', {
      attrs: Util.mix({
        path: path,
        lineDash: DASH_ARR
      }, attrs)
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    var tmp = _getMarkerCfg(cfg, false);

    tmp.lineDash = tmp.lineDash || DASH_ARR;
    return tmp;
  }
}); // draw smooth line shape

Shape.registerShape('line', 'smooth', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var coord = this._coord; // 曲线的限制

    cfg.constraint = [[coord.start.x, coord.end.y], [coord.end.x, coord.start.y]];
    var path = getPath(cfg, true);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getMarkerCfg(cfg, true);
  }
});
Shape.registerShape('line', 'hv', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);

    var path = _getInterPointShapeCfg(cfg, function (point, nextPoint) {
      var tmp = [];
      tmp.push({
        x: nextPoint.x,
        y: point.y
      });
      return tmp;
    });

    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getInterMarkerCfg(cfg, function (x, y, r) {
      return [['M', x - r - 1, y - 2.5], ['L', x, y - 2.5], ['L', x, y + 2.5], ['L', x + r + 1, y + 2.5]];
    });
  }
});
Shape.registerShape('line', 'vh', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);

    var path = _getInterPointShapeCfg(cfg, function (point, nextPoint) {
      var tmp = [];
      tmp.push({
        x: point.x,
        y: nextPoint.y
      });
      return tmp;
    });

    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getInterMarkerCfg(cfg, function (x, y, r) {
      return [['M', x - r - 1, y + 2.5], ['L', x, y + 2.5], ['L', x, y - 2.5], ['L', x + r + 1, y - 2.5]];
    });
  }
});
Shape.registerShape('line', 'hvh', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);

    var path = _getInterPointShapeCfg(cfg, function (point, nextPoint) {
      var tmp = [];
      var middlex = (nextPoint.x - point.x) / 2 + point.x;
      tmp.push({
        x: middlex,
        y: point.y
      });
      tmp.push({
        x: middlex,
        y: nextPoint.y
      });
      return tmp;
    });

    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getInterMarkerCfg(cfg, function (x, y, r) {
      return [['M', x - (r + 1), y + 2.5], ['L', x - r / 2, y + 2.5], ['L', x - r / 2, y - 2.5], ['L', x + r / 2, y - 2.5], ['L', x + r / 2, y + 2.5], ['L', x + r + 1, y + 2.5]];
    });
  }
});
Shape.registerShape('line', 'vhv', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);

    var path = _getInterPointShapeCfg(cfg, function (point, nextPoint) {
      var tmp = [];
      var middley = (nextPoint.y - point.y) / 2 + point.y;
      tmp.push({
        x: point.x,
        y: middley
      });
      tmp.push({
        x: nextPoint.x,
        y: middley
      });
      return tmp;
    });

    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return _getInterMarkerCfg(cfg, function (x, y) {
      // 宽 13px，高 8px
      return [['M', x - 5, y + 2.5], ['L', x - 5, y], ['L', x, y], ['L', x, y - 3], ['L', x, y + 3], ['L', x + 6.5, y + 3]];
    });
  }
});
Line.spline = Line.smooth;
module.exports = Line;