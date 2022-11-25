const Util = require('../../util');
const renderUtil = require('./util');

const SHAPE_ATTRS = [
  'fillStyle',
  'font',
  'globalAlpha',
  'lineCap',
  'lineWidth',
  'lineJoin',
  'miterLimit',
  'shadowBlur',
  'shadowColor',
  'shadowOffsetX',
  'shadowOffsetY',
  'strokeStyle',
  'textAlign',
  'textBaseline',
  'lineDash',
  'lineDashOffset'
];

class Painter {
  constructor(dom) {
    if (!dom) {
      return null;
    }
    const canvasId = Util.uniqueId('canvas_');
    const canvasDom = Util.createDom('<canvas id="' + canvasId + '"></canvas>');
    dom.appendChild(canvasDom);
    this.type = 'canvas';
    this.canvas = canvasDom;
    this.context = canvasDom.getContext('2d');
    this.toDraw = false;
    return this;
  }
  beforeDraw() {
    const el = this.canvas;
    this.context && this.context.clearRect(0, 0, el.width, el.height);
  }
  draw(model) {
    const self = this;
    function drawInner() {
      self.animateHandler = Util.requestAnimationFrame(() => {
        self.animateHandler = undefined;
        if (self.toDraw) {
          drawInner();
        }
      });
      self.beforeDraw();
      try {
        self._drawGroup(model);
      } catch (ev) { // 绘制时异常，中断重绘
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);
        self.toDraw = false;
      }
      self.toDraw = false;
    }
    if (self.animateHandler) {
      self.toDraw = true;
    } else {
      drawInner();
    }
  }
  drawSync(model) {
    this.beforeDraw();
    this._drawGroup(model);
  }
  _drawGroup(group) {
    if (group._cfg.removed || group._cfg.destroyed || !group._cfg.visible) {
      return;
    }
    const self = this;
    const children = group._cfg.children;
    let child = null;
    this.setContext(group);
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      if (children[i].isGroup) {
        self._drawGroup(child);
      } else {
        self._drawShape(child);
      }
    }
    this.restoreContext(group);
  }
  _drawShape(shape) {
    if (shape._cfg.removed || shape._cfg.destroyed || !shape._cfg.visible) {
      return;
    }
    this.setContext(shape);
    shape.drawInner(this.context);
    this.restoreContext(shape);
    shape._cfg.attrs = shape._attrs;
    shape._cfg.hasUpdate = false;
  }
  setContext(shape) {
    const context = this.context;
    const clip = shape._attrs.clip;
    context.save();
    if (clip) {
      // context.save();
      clip.resetTransform(context);
      clip.createPath(context);
      context.clip();
      // context.restore();
    }
    this.resetContext(shape);
    shape.resetTransform(context);
  }
  restoreContext() {
    this.context.restore();
  }
  resetContext(shape) {
    const context = this.context;
    const elAttrs = shape._attrs;
    // var canvas = this.get('canvas');
    if (!shape.isGroup) {
      for (const k in elAttrs) {
        if (SHAPE_ATTRS.indexOf(k) > -1) { // 非canvas属性不附加
          let v = elAttrs[k];
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
  }
}

module.exports = Painter;
