/**
 * @fileOverview shape 的辅助方法
 * @author dxq613@gmail.com
 */
var Util = require('../../util');

var ShapeUtil = {
  splitPoints: function splitPoints(obj) {
    var points = [];
    var x = obj.x;
    var y = obj.y;
    y = Util.isArray(y) ? y : [y];
    Util.each(y, function (yItem, index) {
      var point = {
        x: Util.isArray(x) ? x[index] : x,
        y: yItem
      };
      points.push(point);
    });
    return points;
  },
  addFillAttrs: function addFillAttrs(attrs, cfg) {
    if (cfg.color) {
      attrs.fill = cfg.color;
    }

    if (Util.isNumber(cfg.opacity)) {
      attrs.opacity = attrs.fillOpacity = cfg.opacity;
    }
  },
  addStrokeAttrs: function addStrokeAttrs(attrs, cfg) {
    if (cfg.color) {
      attrs.stroke = cfg.color;
    }

    if (Util.isNumber(cfg.opacity)) {
      attrs.opacity = attrs.strokeOpacity = cfg.opacity;
    }
  }
};
module.exports = ShapeUtil;