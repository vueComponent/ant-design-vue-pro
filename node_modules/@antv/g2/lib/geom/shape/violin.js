/**
 * @fileOverview venn shapes
 * @author leungwensen@gmail.com
 */
var Util = require('../../util');

var Shape = require('./shape');

var ShapeUtil = require('../util/shape');

var Global = require('../../global');

var PathUtil = require('../util/path');

function getAttrs(cfg) {
  var defaultCfg = Global.shape.venn;
  var pathAttrs = Util.mix({}, defaultCfg, cfg.style);
  ShapeUtil.addFillAttrs(pathAttrs, cfg);

  if (cfg.color) {
    pathAttrs.stroke = pathAttrs.stroke || cfg.color;
  }

  return pathAttrs;
}

function getHollowAttrs(cfg) {
  var defaultCfg = Global.shape.hollowVenn;
  var pathAttrs = Util.mix({}, defaultCfg, cfg.style);
  ShapeUtil.addStrokeAttrs(pathAttrs, cfg);
  return pathAttrs;
}

function getViolinPath(points) {
  var path = [];

  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    if (point) {
      var action = i === 0 ? 'M' : 'L';
      path.push([action, point.x, point.y]);
    }
  }

  var first = points[0];

  if (first) {
    path.push(['L', first.x, first.y]);
    path.push(['z']);
  }

  return path;
}

function getSmoothViolinPath(points) {
  var half = points.length / 2;
  var leftPoints = [];
  var rightPoints = [];

  for (var i = 0; i < points.length; i++) {
    if (i < half) {
      leftPoints.push(points[i]);
    } else {
      rightPoints.push(points[i]);
    }
  }

  var leftPath = PathUtil.getSplinePath(leftPoints, false);
  var rightPath = PathUtil.getSplinePath(rightPoints, false);

  if (rightPoints.length) {
    leftPath.push(['L', rightPoints[0].x, rightPoints[0].y]);
  }

  rightPath.shift();
  var path = leftPath.concat(rightPath);

  if (leftPoints.length) {
    path.push(['L', leftPoints[0].x, leftPoints[0].y]);
  }

  path.push(['z']);
  return path;
}

function normalizeSize(arr) {
  var max = Math.max.apply(null, arr);
  return arr.map(function (num) {
    return num / max;
  });
} // register violin geom shape


var Violin = Shape.registerFactory('violin', {
  defaultShapeType: 'violin',
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    var radius = pointInfo.size / 2;
    var points = [];
    var sizeArr = normalizeSize(pointInfo._size);
    Util.each(pointInfo.y, function (y, index) {
      var offset = sizeArr[index] * radius;
      var isMin = index === 0;
      var isMax = index === pointInfo.y.length - 1;
      points.push({
        isMin: isMin,
        isMax: isMax,
        x: pointInfo.x - offset,
        y: y
      });
      points.unshift({
        isMin: isMin,
        isMax: isMax,
        x: pointInfo.x + offset,
        y: y
      });
    });
    return points;
  },
  getActiveCfg: function getActiveCfg(type, cfg) {
    var lineWidth = cfg.lineWidth || 1;

    if (type === 'hollow') {
      return {
        lineWidth: lineWidth + 1
      };
    }

    var opacity = cfg.fillOpacity || cfg.opacity || 1;
    return {
      // lineWidth,
      fillOpacity: opacity - 0.08
    };
  },
  getSelectedCfg: function getSelectedCfg(type, cfg) {
    if (cfg && cfg.style) {
      return cfg.style;
    }

    return this.getActiveCfg(type, cfg);
  }
}); // normal violin, filled path

Shape.registerShape('violin', 'violin', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getViolinPath(cfg.points);
    path = this.parsePath(path);
    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getAttrs(cfg));
  }
}); // smooth spline violin, filled path

Shape.registerShape('violin', 'smooth', {
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getSmoothViolinPath(cfg.points);
    path = this.parsePath(path);
    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getAttrs(cfg));
  }
}); // hollow violin, stroked path

Shape.registerShape('violin', 'hollow', {
  draw: function draw(cfg, container) {
    var attrs = getHollowAttrs(cfg);
    var path = getViolinPath(cfg.points);
    path = this.parsePath(path);
    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getHollowAttrs(cfg));
  }
}); // hollow smooth spline violin, stroked path

Shape.registerShape('violin', 'smoothHollow', {
  draw: function draw(cfg, container) {
    var attrs = getHollowAttrs(cfg);
    var path = getSmoothViolinPath(cfg.points);
    path = this.parsePath(path);
    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getHollowAttrs(cfg));
  }
});
module.exports = Violin;