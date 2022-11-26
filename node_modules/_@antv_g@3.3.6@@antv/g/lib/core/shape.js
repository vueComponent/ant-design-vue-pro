var Util = require('../util/index');

var isPointInPath = require('./mixin/isPointInPath');

var Element = require('./element');

var Inside = require('../shapes/util/inside');

var Shape = function Shape(cfg) {
  Shape.superclass.constructor.call(this, cfg);
};

Shape.ATTRS = {};
Util.extend(Shape, Element);
var ARRAY_ATTRS = {
  matrix: 'matrix',
  path: 'path',
  points: 'points',
  lineDash: 'lineDash'
};

function _cloneArrayAttr(arr) {
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    if (Util.isArray(arr[i])) {
      result.push([].concat(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }

  return result;
}

Util.augment(Shape, isPointInPath, {
  isShape: true,
  drawInner: function drawInner(context) {
    var self = this;
    var attrs = self._attrs;
    self.createPath(context);
    var originOpacity = context.globalAlpha;

    if (self.hasFill()) {
      var fillOpacity = attrs.fillOpacity;

      if (!Util.isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
        context.fill();
        context.globalAlpha = originOpacity;
      } else {
        context.fill();
      }
    }

    if (self.hasStroke()) {
      var lineWidth = self._attrs.lineWidth;

      if (lineWidth > 0) {
        var strokeOpacity = attrs.strokeOpacity;

        if (!Util.isNil(strokeOpacity) && strokeOpacity !== 1) {
          context.globalAlpha = strokeOpacity;
        }

        context.stroke();
      }
    }

    self.afterPath(context);
  },
  afterPath: function afterPath() {},

  /**
   * 击中图形时是否进行包围盒判断
   * @return {Boolean} [description]
   */
  isHitBox: function isHitBox() {
    return true;
  },

  /**
   * 节点是否能够被击中
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   * @return {Boolean} 是否在图形中
   */
  isHit: function isHit(x, y) {
    var self = this;
    var v = [x, y, 1];
    self.invert(v); // canvas

    if (self.isHitBox()) {
      var box = self.getBBox();

      if (box && !Inside.box(box.minX, box.maxX, box.minY, box.maxY, v[0], v[1])) {
        return false;
      }
    }

    var clip = self._attrs.clip;

    if (clip) {
      clip.invert(v, self.get('canvas'));

      if (clip.isPointInPath(v[0], v[1])) {
        return self.isPointInPath(v[0], v[1]);
      }
    } else {
      return self.isPointInPath(v[0], v[1]);
    }

    return false;
  },

  /**
   * @protected
   * 计算包围盒
   * @return {Object} 包围盒
   */
  calculateBox: function calculateBox() {
    return null;
  },
  // 获取拾取时线的宽度，需要考虑附加的线的宽度
  getHitLineWidth: function getHitLineWidth() {
    var attrs = this._attrs; // if (!attrs.stroke) {
    //   return 0;
    // }

    var lineAppendWidth = attrs.lineAppendWidth || 0;
    var lineWidth = attrs.lineWidth || 0;
    return lineWidth + lineAppendWidth;
  },
  // 清除当前的矩阵
  clearTotalMatrix: function clearTotalMatrix() {
    this._cfg.totalMatrix = null;
    this._cfg.region = null;
  },
  clearBBox: function clearBBox() {
    this._cfg.box = null;
    this._cfg.region = null;
  },
  getBBox: function getBBox() {
    var box = this._cfg.box; // 延迟计算

    if (!box) {
      box = this.calculateBox();

      if (box) {
        box.x = box.minX;
        box.y = box.minY;
        box.width = box.maxX - box.minX;
        box.height = box.maxY - box.minY;
      }

      this._cfg.box = box;
    }

    return box;
  },
  clone: function clone() {
    var self = this;
    var clone = null;
    var _attrs = self._attrs;
    var attrs = {};
    Util.each(_attrs, function (i, k) {
      if (ARRAY_ATTRS[k] && Util.isArray(_attrs[k])) {
        attrs[k] = _cloneArrayAttr(_attrs[k]);
      } else {
        attrs[k] = _attrs[k];
      }
    });
    clone = new self.constructor({
      attrs: attrs
    }); // zIndex也是绘图属性，但是在cfg中，特殊处理

    clone._cfg.zIndex = self._cfg.zIndex;
    return clone;
  }
});
module.exports = Shape;