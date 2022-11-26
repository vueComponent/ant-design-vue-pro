var Util = require('./util/index');

var Event = require('./event');

var Group = require('./core/group');

var Timeline = require('./core/mixin/timeline');

var renderers = require('./renderers/index');

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
  renderer: 'canvas'
};
Util.extend(Canvas, Group);
Util.augment(Canvas, {
  init: function init() {
    Canvas.superclass.init.call(this);

    this._setGlobalParam();

    this._setContainer();

    this._initPainter();

    this._scale();

    if (this.get('eventEnable')) {
      this._registEvents();
    }
  },
  getEmitter: function getEmitter(element, event) {
    if (element) {
      if (Util.isEmpty(element._getEvents())) {
        var parent = element.get('parent');

        if (parent && !event.propagationStopped) {
          return this.getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  },
  _getEventObj: function _getEventObj(type, e, point, target) {
    var event = new Event(type, e, true, true);
    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent: function _triggerEvent(type, e) {
    var point = this.getPointByClient(e.clientX, e.clientY);
    var shape = this.getShape(point.x, point.y, e);
    var el = this.get('el');
    var emitObj;

    if (type === 'mousemove') {
      var preShape = this.get('preShape');

      if (preShape && preShape !== shape) {
        var mouseleave = this._getEventObj('mouseleave', e, point, preShape);

        emitObj = this.getEmitter(preShape, e);
        emitObj && emitObj.emit('mouseleave', mouseleave);
        el.style.cursor = 'default';
      }

      if (shape) {
        var mousemove = this._getEventObj('mousemove', e, point, shape);

        emitObj = this.getEmitter(shape, e);
        emitObj && emitObj.emit('mousemove', mousemove);

        if (preShape !== shape) {
          var mouseenter = this._getEventObj('mouseenter', e, point, shape);

          emitObj && emitObj.emit('mouseenter', mouseenter, e);
        }
      } else {
        var canvasmousemove = this._getEventObj('mousemove', e, point, this);

        this.emit('mousemove', canvasmousemove);
      }

      this.set('preShape', shape);
    } else {
      var event = this._getEventObj(type, e, point, shape || this);

      emitObj = this.getEmitter(shape, e);

      if (emitObj && emitObj !== this) {
        emitObj.emit(type, event);
      }

      this.emit(type, event);
    }

    if (shape && !shape.get('destroyed')) {
      el.style.cursor = shape.attr('cursor') || 'default';
    }
  },
  _registEvents: function _registEvents() {
    var self = this;
    var el = self.get('el');
    var events = ['mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseleave', 'mouseup', 'click', 'dblclick'];
    Util.each(events, function (event) {
      el.addEventListener(event, function (e) {
        self._triggerEvent(event, e);
      }, false);
    }); // special cases

    el.addEventListener('touchstart', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);
    el.addEventListener('touchmove', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);
    el.addEventListener('touchend', function (e) {
      if (!Util.isEmpty(e.changedTouches)) {
        self._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
  },
  _scale: function _scale() {
    var pixelRatio = this.get('pixelRatio');
    this.scale(pixelRatio, pixelRatio);
  },
  _setGlobalParam: function _setGlobalParam() {
    var pixelRatio = this.get('pixelRatio');

    if (!pixelRatio) {
      this.set('pixelRatio', Util.getRatio());
    }

    var renderer = renderers[this.get('renderer') || 'canvas'];
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