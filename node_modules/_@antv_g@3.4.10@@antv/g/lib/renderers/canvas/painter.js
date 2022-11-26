var Util = require('../../util');

var renderUtil = require('./util');

var SHAPE_ATTRS = ['fillStyle', 'font', 'globalAlpha', 'lineCap', 'lineWidth', 'lineJoin', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline', 'lineDash', 'lineDashOffset'];

var Painter = /*#__PURE__*/function () {
  function Painter(dom) {
    if (!dom) {
      return null;
    }

    var canvasId = Util.uniqueId('canvas_');
    var canvasDom = Util.createDom('<canvas id="' + canvasId + '"></canvas>');
    dom.appendChild(canvasDom);
    this.type = 'canvas';
    this.canvas = canvasDom;
    this.context = canvasDom.getContext('2d');
    this.toDraw = false;
    return this;
  }

  var _proto = Painter.prototype;

  _proto.beforeDraw = function beforeDraw() {
    var el = this.canvas;
    this.context && this.context.clearRect(0, 0, el.width, el.height);
  };

  _proto.draw = function draw(model) {
    var self = this;

    function drawInner() {
      self.animateHandler = Util.requestAnimationFrame(function () {
        self.animateHandler = undefined;

        if (self.toDraw) {
          drawInner();
        }
      });
      self.beforeDraw();

      try {
        self._drawGroup(model);
      } catch (ev) {
        // 绘制时异常，中断重绘
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);
      } finally {
        self.toDraw = false;
      }
    }

    if (self.animateHandler) {
      self.toDraw = true;
    } else {
      drawInner();
    }
  };

  _proto.drawSync = function drawSync(model) {
    this.beforeDraw();

    this._drawGroup(model);
  };

  _proto._drawGroup = function _drawGroup(group) {
    if (group._cfg.removed || group._cfg.destroyed || !group._cfg.visible) {
      return;
    }

    var self = this;
    var children = group._cfg.children;
    var child = null;
    this.setContext(group);

    for (var i = 0; i < children.length; i++) {
      child = children[i];

      if (children[i].isGroup) {
        self._drawGroup(child);
      } else {
        self._drawShape(child);
      }
    }

    this.restoreContext(group);
  };

  _proto._drawShape = function _drawShape(shape) {
    if (shape._cfg.removed || shape._cfg.destroyed || !shape._cfg.visible) {
      return;
    }

    this.setContext(shape);
    shape.drawInner(this.context);
    this.restoreContext(shape);
    shape._cfg.attrs = shape._attrs;
    shape._cfg.hasUpdate = false;
  };

  _proto.setContext = function setContext(shape) {
    var context = this.context;
    var clip = shape._attrs.clip;
    context.save();

    if (clip) {
      // context.save();
      clip.resetTransform(context);
      clip.createPath(context);
      context.clip(); // context.restore();
    }

    this.resetContext(shape);
    shape.resetTransform(context);
  };

  _proto.restoreContext = function restoreContext() {
    this.context.restore();
  };

  _proto.resetContext = function resetContext(shape) {
    var context = this.context;
    var elAttrs = shape._attrs; // var canvas = this.get('canvas');

    if (!shape.isGroup) {
      for (var k in elAttrs) {
        if (SHAPE_ATTRS.indexOf(k) > -1) {
          // 非canvas属性不附加
          var v = elAttrs[k];

          if (k === 'fillStyle') {
            v = renderUtil.parseStyle(v, shape, context);
          }

          if (k === 'strokeStyle') {
            v = renderUtil.parseStyle(v, shape, context);
          }

          if (k === 'lineDash' && context.setLineDash) {
            if (Util.isArray(v)) {
              context.setLineDash(v);
            } else if (Util.isString(v)) {
              context.setLineDash(v.split(' '));
            }
          } else {
            context[k] = v;
          }
        }
      }
    }
  };

  return Painter;
}();

module.exports = Painter;