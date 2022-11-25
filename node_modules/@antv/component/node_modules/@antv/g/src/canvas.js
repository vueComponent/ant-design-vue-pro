const Util = require('./util/index');
const Event = require('./event');
const Group = require('./core/group');
const Timeline = require('./core/mixin/timeline');
const renderers = require('./renderers/index');

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
  renderer: 'canvas'
};

Util.extend(Canvas, Group);

Util.augment(Canvas, {
  init() {
    Canvas.superclass.init.call(this);
    this._setGlobalParam();
    this._setContainer();
    this._initPainter();
    this._scale();
    if (this.get('eventEnable')) {
      this._registEvents();
    }
  },
  getEmitter(element, event) {
    if (element) {
      if (Util.isEmpty(element._getEvents())) {
        const parent = element.get('parent');
        if (parent && !event.propagationStopped) {
          return this.getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  },
  _getEventObj(type, e, point, target) {
    const event = new Event(type, e, true, true);
    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent(type, e) {
    const point = this.getPointByClient(e.clientX, e.clientY);
    const shape = this.getShape(point.x, point.y, e);
    const el = this.get('el');
    let emitObj;
    if (type === 'mousemove') {
      const preShape = this.get('preShape');
      if (preShape && preShape !== shape) {
        const mouseleave = this._getEventObj('mouseleave', e, point, preShape);
        emitObj = this.getEmitter(preShape, e);
        emitObj && emitObj.emit('mouseleave', mouseleave);
        el.style.cursor = 'default';
      }

      if (shape) {
        const mousemove = this._getEventObj('mousemove', e, point, shape);
        emitObj = this.getEmitter(shape, e);
        emitObj && emitObj.emit('mousemove', mousemove);

        if (preShape !== shape) {
          const mouseenter = this._getEventObj('mouseenter', e, point, shape);
          emitObj && emitObj.emit('mouseenter', mouseenter, e);
        }
      } else {
        const canvasmousemove = this._getEventObj('mousemove', e, point, this);
        this.emit('mousemove', canvasmousemove);
      }

      this.set('preShape', shape);
    } else {
      const event = this._getEventObj(type, e, point, shape || this);
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
  _registEvents() {
    const self = this;
    const el = self.get('el');
    const events = [
      'mouseout',
      'mouseover',
      'mousemove',
      'mousedown',
      'mouseleave',
      'mouseup',
      'click',
      'dblclick'
    ];
    Util.each(events, event => {
      el.addEventListener(event, e => {
        self._triggerEvent(event, e);
      }, false);
    });
    // special cases
    el.addEventListener('touchstart', e => {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchmove', e => {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchend', e => {
      if (!Util.isEmpty(e.changedTouches)) {
        self._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
  },
  _scale() {
    const pixelRatio = this.get('pixelRatio');
    this.scale(pixelRatio, pixelRatio);
  },
  _setGlobalParam() {
    const pixelRatio = this.get('pixelRatio');
    if (!pixelRatio) {
      this.set('pixelRatio', Util.getRatio());
    }
    const renderer = renderers[this.get('renderer') || 'canvas'];
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
