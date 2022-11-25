/**
 * @fileOverview line shapes
 * @author dxq613@gmail.com
 * @author sima.zhang1990@gmail.com
 * @author huangtonger@aliyun.com
 # @author liuye10@yahoo.com
 */
var Util = require('../../util');

var Shape = require('./shape');

var ShapeUtil = require('../util/shape');

var Global = require('../../global');

function getAttrs(cfg) {
  var defaultCfg = Global.shape.polygon;
  var pathAttrs = Util.mix({}, defaultCfg, cfg.style);
  ShapeUtil.addFillAttrs(pathAttrs, cfg);
  return pathAttrs;
}

function getHollowAttrs(cfg) {
  var defaultCfg = Global.shape.hollowPolygon;
  var pathAttrs = Util.mix({}, defaultCfg, cfg.style);
  ShapeUtil.addStrokeAttrs(pathAttrs, cfg);
  return pathAttrs;
}

function getPath(points) {
  var flag = points[0];
  var i = 1;
  var path = [['M', flag.x, flag.y]];

  while (i < points.length) {
    var c = points[i];

    if (c.x !== points[i - 1].x || c.y !== points[i - 1].y) {
      path.push(['L', c.x, c.y]);

      if (c.x === flag.x && c.y === flag.y && i < points.length - 1) {
        flag = points[i + 1];
        path.push(['Z']);
        path.push(['M', flag.x, flag.y]);
        i++;
      }
    }

    i++;
  }

  if (!Util.isEqual(path[path.length - 1], flag)) {
    path.push(['L', flag.x, flag.y]);
  }

  path.push(['Z']);
  return path;
} // regist line geom


var Polygon = Shape.registerFactory('polygon', {
  defaultShapeType: 'polygon',
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    var points = [];
    Util.each(pointInfo.x, function (subX, index) {
      var subY = pointInfo.y[index];
      points.push({
        x: subX,
        y: subY
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
});
Shape.registerShape('polygon', 'polygon', {
  draw: function draw(cfg, container) {
    if (!Util.isEmpty(cfg.points)) {
      var attrs = getAttrs(cfg);
      var path = getPath(cfg.points);
      path = this.parsePath(path);
      return container.addShape('path', {
        attrs: Util.mix(attrs, {
          path: path
        })
      });
    }
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'square',
      radius: 4
    }, getAttrs(cfg));
  }
});
Shape.registerShape('polygon', 'hollow', {
  draw: function draw(cfg, container) {
    if (!Util.isEmpty(cfg.points)) {
      var attrs = getHollowAttrs(cfg);
      var path = getPath(cfg.points);
      path = this.parsePath(path);
      return container.addShape('path', {
        attrs: Util.mix(attrs, {
          path: path
        })
      });
    }
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'square',
      radius: 4
    }, getAttrs(cfg));
  }
});
module.exports = Polygon;