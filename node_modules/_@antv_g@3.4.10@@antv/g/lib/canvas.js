var _require = require('detect-browser'),
    detect = _require.detect;

var Util = require('./util/index');

var Event = require('./core/mixin/event');

var Group = require('./core/group');

var Timeline = require('./core/mixin/timeline');

var renderers = require('./renderers/index');

var browser = detect();
var isFirefox = browser && browser.name === 'firefox';

var Canvas = function Canvas(cfg) {
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
  init: function init() {
    Canvas.superclass.init.call(this);

    this._setGlobalParam();

    this._setContainer();

    this._initPainter();

    this._scale();

    if (this.get('eventEnable')) {
      this.registerEvent(this);
    }
  },
  _scale: function _scale() {
    if (this._cfg.renderType !== 'svg') {
      var pixelRatio = this.get('pixelRatio');
      this.scale(pixelRatio, pixelRatio);
    }
  },
  _setGlobalParam: function _setGlobalParam() {
    var renderType = this.get('renderer') || 'canvas';

    if (renderType === 'svg') {
      this.set('pixelRatio', 1);
    } else if (!this.get('pixelRatio')) {
      this.set('pixelRatio', Util.getRatio());
    }

    this._cfg.renderType = renderType;
    var renderer = renderers[renderType];
    this._cfg.renderer = renderer;
    this._cfg.canvas = this;
    var timeline = new Timeline(this);
    this._cfg.timeline = timeline;
  },
  _setContainer: function _setContainer() {
    var containerId = this.get('containerId');
    var containerDOM = this.get('containerDOM');

    if (!containerDOM) {
      containerDOM = document.getElementById(containerId);
      this.set('containerDOM', containerDOM);
    }

    Util.modifyCSS(containerDOM, {
      position: 'relative'
    });
  },
  _initPainter: function _initPainter() {
    var containerDOM = this.get('containerDOM');
    var painter = new this._cfg.renderer.painter(containerDOM);
    this._cfg.painter = painter;
    this._cfg.canvasDOM = this._cfg.el = painter.canvas;
    this.changeSize(this.get('width'), this.get('height'));
  },
  _resize: function _resize() {
    var canvasDOM = this.get('canvasDOM');
    var widthCanvas = this.get('widthCanvas');
    var heightCanvas = this.get('heightCanvas');
    var widthStyle = this.get('widthStyle');
    var heightStyle = this.get('heightStyle');
    canvasDOM.style.width = widthStyle;
    canvasDOM.style.height = heightStyle;
    canvasDOM.setAttribute('width', widthCanvas);
    canvasDOM.setAttribute('height', heightCanvas);
  },
  getWidth: function getWidth() {
    var pixelRatio = this.get('pixelRatio');
    var width = this.get('width');
    return width * pixelRatio;
  },
  getHeight: function getHeight() {
    var pixelRatio = this.get('pixelRatio');
    var height = this.get('height');
    return height * pixelRatio;
  },
  changeSize: function changeSize(width, height) {
    var pixelRatio = this.get('pixelRatio');
    var widthCanvas = width * pixelRatio;
    var heightCanvas = height * pixelRatio;
    this.set('widthCanvas', widthCanvas);
    this.set('heightCanvas', heightCanvas);
    this.set('widthStyle', width + 'px');
    this.set('heightStyle', height + 'px');
    this.set('width', width);
    this.set('height', height);

    this._resize();
  },
  getPointByEvent: function getPointByEvent(ev) {
    var supportCSSTransform = this.get('supportCSSTransform');

    if (supportCSSTransform) {
      var pixelRatio = this.get('pixelRatio') || 1; // For Firefox <= 38

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
    } // should calculate by self for other cases, like Safari in ios
    // TODO: support CSS transform


    var _this$getClientByEven = this.getClientByEvent(ev),
        clientX = _this$getClientByEven.x,
        clientY = _this$getClientByEven.y;

    return this.getPointByClient(clientX, clientY);
  },
  // 获取 touch 事件的 clientX 和 clientY 需要单独处理
  getClientByEvent: function getClientByEvent(ev) {
    var clientInfo = ev;

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
  getPointByClient: function getPointByClient(clientX, clientY) {
    var el = this.get('el');
    var pixelRatio = this.get('pixelRatio') || 1;
    var bbox = el.getBoundingClientRect();
    return {
      x: (clientX - bbox.left) * pixelRatio,
      y: (clientY - bbox.top) * pixelRatio
    };
  },
  getClientByPoint: function getClientByPoint(x, y) {
    var el = this.get('el');
    var bbox = el.getBoundingClientRect();
    var pixelRatio = this.get('pixelRatio') || 1;
    return {
      clientX: x / pixelRatio + bbox.left,
      clientY: y / pixelRatio + bbox.top
    };
  },
  draw: function draw() {
    this._cfg.painter.draw(this);
  },
  getShape: function getShape(x, y, e) {
    if (arguments.length === 3 && this._cfg.renderer.getShape) {
      return this._cfg.renderer.getShape.call(this, x, y, e);
    }

    return Canvas.superclass.getShape.call(this, x, y);
  },
  getRenderer: function getRenderer() {
    return this._cfg.renderType;
  },
  _drawSync: function _drawSync() {
    this._cfg.painter.drawSync(this);
  },
  destroy: function destroy() {
    var cfg = this._cfg;
    var containerDOM = cfg.containerDOM;
    var canvasDOM = cfg.canvasDOM;

    if (canvasDOM && containerDOM) {
      containerDOM.removeChild(canvasDOM);
    }

    cfg.timeline.stop();
    Canvas.superclass.destroy.call(this);
  }
});
module.exports = Canvas;