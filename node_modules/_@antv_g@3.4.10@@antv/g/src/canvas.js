const { detect } = require('detect-browser');
const Util = require('./util/index');
const Event = require('./core/mixin/event');
const Group = require('./core/group');
const Timeline = require('./core/mixin/timeline');
const renderers = require('./renderers/index');

const browser = detect();
const isFirefox = browser && browser.name === 'firefox';

const Canvas = function(cfg) {
  Canvas.superclass.constructor.call(this, cfg);
};

Canvas.CFG = {
  eventEnable: true,
  /**
   * 像素宽度
   * @type {Number}
   */
  width: null,
  /**
   * 像素高度
   * @type {Number}
   */
  height: null,
  /**
   * 画布宽度
   * @type {Number}
   */
  widthCanvas: null,
  /**
   * 画布高度
   * @type {Number}
   */
  heightCanvas: null,
  /**
   * CSS宽
   * @type {String}
   */
  widthStyle: null,
  /**
   * CSS高
   * @type {String}
   */
  heightStyle: null,
  /**
   * 容器DOM
   * @type {Object}
   */
  containerDOM: null,
  /**
   * 当前Canvas的DOM
   * @type {Object}
   */
  canvasDOM: null,
  /**
   * 屏幕像素比
   * @type {Number}
   */
  pixelRatio: null,
  /**
   * 渲染器，默认是canvas
   * @type {String}
   */
  renderer: 'canvas',
  /**
   * 是否支持 CSS Transform
   * CSS transform 目前尚未经过长时间验证，为了避免影响上层业务，默认关闭，上层按需开启
   */
  supportCSSTransform: false
};

Util.extend(Canvas, Group);

Util.augment(Canvas, Event, {
  init() {
    Canvas.superclass.init.call(this);
    this._setGlobalParam();
    this._setContainer();
    this._initPainter();
    this._scale();
    if (this.get('eventEnable')) {
      this.registerEvent(this);
    }
  },
  _scale() {
    if (this._cfg.renderType !== 'svg') {
      const pixelRatio = this.get('pixelRatio');
      this.scale(pixelRatio, pixelRatio);
    }
  },
  _setGlobalParam() {
    const renderType = this.get('renderer') || 'canvas';
    if (renderType === 'svg') {
      this.set('pixelRatio', 1);
    } else if (!this.get('pixelRatio')) {
      this.set('pixelRatio', Util.getRatio());
    }
    this._cfg.renderType = renderType;
    const renderer = renderers[renderType];
    this._cfg.renderer = renderer;
    this._cfg.canvas = this;
    const timeline = new Timeline(this);
    this._cfg.timeline = timeline;
  },
  _setContainer() {
    const containerId = this.get('containerId');
    let containerDOM = this.get('containerDOM');
    if (!containerDOM) {
      containerDOM = document.getElementById(containerId);
      this.set('containerDOM', containerDOM);
    }
    Util.modifyCSS(containerDOM, {
      position: 'relative'
    });
  },
  _initPainter() {
    const containerDOM = this.get('containerDOM');
    const painter = new this._cfg.renderer.painter(containerDOM);
    this._cfg.painter = painter;
    this._cfg.canvasDOM = this._cfg.el = painter.canvas;
    this.changeSize(this.get('width'), this.get('height'));
  },
  _resize() {
    const canvasDOM = this.get('canvasDOM');
    const widthCanvas = this.get('widthCanvas');
    const heightCanvas = this.get('heightCanvas');
    const widthStyle = this.get('widthStyle');
    const heightStyle = this.get('heightStyle');

    canvasDOM.style.width = widthStyle;
    canvasDOM.style.height = heightStyle;
    canvasDOM.setAttribute('width', widthCanvas);
    canvasDOM.setAttribute('height', heightCanvas);
  },
  getWidth() {
    const pixelRatio = this.get('pixelRatio');
    const width = this.get('width');
    return width * pixelRatio;
  },
  getHeight() {
    const pixelRatio = this.get('pixelRatio');
    const height = this.get('height');
    return height * pixelRatio;
  },
  changeSize(width, height) {
    const pixelRatio = this.get('pixelRatio');
    const widthCanvas = width * pixelRatio;
    const heightCanvas = height * pixelRatio;

    this.set('widthCanvas', widthCanvas);
    this.set('heightCanvas', heightCanvas);
    this.set('widthStyle', width + 'px');
    this.set('heightStyle', height + 'px');
    this.set('width', width);
    this.set('height', height);
    this._resize();
  },
  getPointByEvent(ev) {
    const supportCSSTransform = this.get('supportCSSTransform');
    if (supportCSSTransform) {
      const pixelRatio = this.get('pixelRatio') || 1;
      // For Firefox <= 38
      if (isFirefox && !Util.isNil(ev.layerX) && ev.layerX !== ev.offsetX) {
        return {
          x: ev.layerX * pixelRatio,
          y: ev.layerY * pixelRatio
        };
      }
      if (!Util.isNil(ev.offsetX)) {
        // For IE6+, Firefox >= 39, Chrome, Safari, Opera
        return {
          x: ev.offsetX * pixelRatio,
          y: ev.offsetY * pixelRatio
        };
      }
    }
    // should calculate by self for other cases, like Safari in ios
    // TODO: support CSS transform
    const { x: clientX, y: clientY } = this.getClientByEvent(ev);
    return this.getPointByClient(clientX, clientY);
  },
  // 获取 touch 事件的 clientX 和 clientY 需要单独处理
  getClientByEvent(ev) {
    let clientInfo = ev;
    if (ev.touches) {
      if (ev.type === 'touchend') {
        clientInfo = ev.changedTouches[0];
      } else {
        clientInfo = ev.touches[0];
      }
    }
    return {
      x: clientInfo.clientX,
      y: clientInfo.clientY
    };
  },
  /**
   * 将窗口坐标转变成 canvas 坐标
   * @param  {Number} clientX 窗口x坐标
   * @param  {Number} clientY 窗口y坐标
   * @return {Object} canvas坐标
   */
  getPointByClient(clientX, clientY) {
    const el = this.get('el');
    const pixelRatio = this.get('pixelRatio') || 1;
    const bbox = el.getBoundingClientRect();
    return {
      x: (clientX - bbox.left) * pixelRatio,
      y: (clientY - bbox.top) * pixelRatio
    };
  },
  getClientByPoint(x, y) {
    const el = this.get('el');
    const bbox = el.getBoundingClientRect();
    const pixelRatio = this.get('pixelRatio') || 1;
    return {
      clientX: x / pixelRatio + bbox.left,
      clientY: y / pixelRatio + bbox.top
    };
  },
  draw() {
    this._cfg.painter.draw(this);
  },
  getShape(x, y, e) {
    if (arguments.length === 3 && this._cfg.renderer.getShape) {
      return this._cfg.renderer.getShape.call(this, x, y, e);
    }
    return Canvas.superclass.getShape.call(this, x, y);
  },
  getRenderer() {
    return this._cfg.renderType;
  },
  _drawSync() {
    this._cfg.painter.drawSync(this);
  },
  destroy() {
    const cfg = this._cfg;
    const containerDOM = cfg.containerDOM;
    const canvasDOM = cfg.canvasDOM;
    if (canvasDOM && containerDOM) {
      containerDOM.removeChild(canvasDOM);
    }
    cfg.timeline.stop();
    Canvas.superclass.destroy.call(this);
  }
});

module.exports = Canvas;
