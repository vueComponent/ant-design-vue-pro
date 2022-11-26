/**
 * @fileOverview 自定义的 shape
 * @author dxq613@gmail.com
 * @author sima.zhang1990@gmail.com
 */
var Util = require('../../util');

var Shape = require('./shape');

var ShapeUtil = require('../util/shape');

var Global = require('../../global');

function _parseValue(value) {
  if (!Util.isArray(value)) {
    value = [value];
  }

  var min = value[0]; // 最小值

  var max = value[value.length - 1]; // 最大值

  var min1 = value.length > 1 ? value[1] : min;
  var max1 = value.length > 3 ? value[3] : max;
  var median = value.length > 2 ? value[2] : min1;
  return {
    min: min,
    // 最小值
    max: max,
    // 最大值
    min1: min1,
    max1: max1,
    median: median
  };
}

function addPoints(from, to) {
  Util.each(from, function (subArr) {
    to.push({
      x: subArr[0],
      y: subArr[1]
    });
  });
}

function getAttrs(cfg) {
  var defaultAttrs = Global.shape.schema;
  var lineAttrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addStrokeAttrs(lineAttrs, cfg);
  return lineAttrs;
}

function getFillAttrs(cfg) {
  var defaultAttrs = Global.shape.schema;
  var lineAttrs = Util.mix({}, defaultAttrs, cfg.style);
  ShapeUtil.addFillAttrs(lineAttrs, cfg);

  if (cfg.color) {
    lineAttrs.stroke = cfg.color || lineAttrs.stroke;
  }

  return lineAttrs;
}

function getBoxPoints(x, y, width) {
  var points = [];
  var pointsArray;
  var obj;

  if (Util.isArray(y)) {
    // 2维
    obj = _parseValue(y);
    pointsArray = [[x - width / 2, obj.max], [x + width / 2, obj.max], [x, obj.max], [x, obj.max1], [x - width / 2, obj.min1], [x - width / 2, obj.max1], [x + width / 2, obj.max1], [x + width / 2, obj.min1], [x, obj.min1], [x, obj.min], [x - width / 2, obj.min], [x + width / 2, obj.min], [x - width / 2, obj.median], [x + width / 2, obj.median]];
  } else {
    // 只有一个维度
    y = y || 0.5;
    obj = _parseValue(x);
    pointsArray = [[obj.min, y - width / 2], [obj.min, y + width / 2], [obj.min, y], [obj.min1, y], [obj.min1, y - width / 2], [obj.min1, y + width / 2], [obj.max1, y + width / 2], [obj.max1, y - width / 2], [obj.max1, y], [obj.max, y], [obj.max, y - width / 2], [obj.max, y + width / 2], [obj.median, y - width / 2], [obj.median, y + width / 2]];
  }

  addPoints(pointsArray, points);
  return points;
}

function _sortValue(value) {
  if (!Util.isArray(value)) {
    value = [value];
  } // 从大到小排序


  var sorted = value.sort(function (a, b) {
    return a < b ? 1 : -1;
  });
  var length = sorted.length;

  if (length < 4) {
    var min = sorted[length - 1];

    for (var i = 0; i < 4 - length; i++) {
      sorted.push(min);
    }
  }

  return sorted;
} // 获取K线图的points


function getCandlePoints(x, y, width) {
  var yValues = _sortValue(y);

  var points = [{
    x: x,
    y: yValues[0]
  }, {
    x: x,
    y: yValues[1]
  }, {
    x: x - width / 2,
    y: yValues[2]
  }, {
    x: x - width / 2,
    y: yValues[1]
  }, {
    x: x + width / 2,
    y: yValues[1]
  }, {
    x: x + width / 2,
    y: yValues[2]
  }, {
    x: x,
    y: yValues[2]
  }, {
    x: x,
    y: yValues[3]
  }]; // 按照顺时针连接

  return points;
}

function getBoxPath(points) {
  var path = [['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['M', points[4].x, points[4].y], ['L', points[5].x, points[5].y], ['L', points[6].x, points[6].y], ['L', points[7].x, points[7].y], ['L', points[4].x, points[4].y], // 封闭 z
  ['Z'], ['M', points[8].x, points[8].y], ['L', points[9].x, points[9].y], ['M', points[10].x, points[10].y], ['L', points[11].x, points[11].y], ['M', points[12].x, points[12].y], ['L', points[13].x, points[13].y]];
  return path;
}

function getCandlePath(points) {
  var path = [['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['L', points[4].x, points[4].y], ['L', points[5].x, points[5].y], ['Z'], ['M', points[6].x, points[6].y], ['L', points[7].x, points[7].y]];
  return path;
}

var Schema = Shape.registerFactory('schema', {
  defaultShapeType: '',
  getActiveCfg: function getActiveCfg(type, cfg) {
    if (type === 'box') {
      var lineWidth = cfg.lineWidth || 1;
      return {
        lineWidth: lineWidth + 1
      };
    }

    var opacity = cfg.fillOpacity || cfg.opacity || 1;
    return {
      fillOpacity: opacity - 0.15,
      strokeOpacity: opacity - 0.15
    };
  },
  getSelectedCfg: function getSelectedCfg(type, cfg) {
    if (cfg && cfg.style) {
      return cfg.style;
    }

    return this.getActiveCfg(type, cfg);
  }
}); // 箱线图

Shape.registerShape('schema', 'box', {
  getPoints: function getPoints(pointInfo) {
    return getBoxPoints(pointInfo.x, pointInfo.y, pointInfo.size);
  },
  draw: function draw(cfg, container) {
    var attrs = getAttrs(cfg);
    var path = getBoxPath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return {
      symbol: function symbol(x, y, r) {
        var yValues = [y - 6, y - 3, y, y + 3, y + 6];
        var points = getBoxPoints(x, yValues, r);
        return [['M', points[0].x + 1, points[0].y], ['L', points[1].x - 1, points[1].y], ['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['M', points[4].x, points[4].y], ['L', points[5].x, points[5].y], ['L', points[6].x, points[6].y], ['L', points[7].x, points[7].y], ['L', points[4].x, points[4].y], ['Z'], ['M', points[8].x, points[8].y], ['L', points[9].x, points[9].y], ['M', points[10].x + 1, points[10].y], ['L', points[11].x - 1, points[11].y], ['M', points[12].x, points[12].y], ['L', points[13].x, points[13].y]];
      },
      radius: 6,
      lineWidth: 1,
      stroke: cfg.color
    };
  }
}); // K线

Shape.registerShape('schema', 'candle', {
  getPoints: function getPoints(pointInfo) {
    return getCandlePoints(pointInfo.x, pointInfo.y, pointInfo.size);
  },
  draw: function draw(cfg, container) {
    var attrs = getFillAttrs(cfg);
    var path = getCandlePath(cfg.points);
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: path
      })
    });
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return {
      symbol: function symbol(x, y, r) {
        y = [y + 7.5, y + 3, y - 3, y - 7.5];
        var points = getCandlePoints(x, y, r);
        return [['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['L', points[4].x, points[4].y], ['L', points[5].x, points[5].y], ['Z'], ['M', points[6].x, points[6].y], ['L', points[7].x, points[7].y]];
      },
      lineWidth: 1,
      stroke: cfg.color,
      fill: cfg.color,
      radius: 6
    };
  }
});
module.exports = Schema;