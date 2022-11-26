var Util = require('../util/index');

var Attribute = require('./mixin/attribute');

var Transform = require('./mixin/transform');

var Animate = require('./mixin/animation');

var EventEmitter = require('./advanced-event-emitter');

var Element = function Element(cfg) {
  this._cfg = {
    zIndex: 0,
    capture: true,
    visible: true,
    destroyed: false
  }; // 配置存放地

  Util.assign(this._cfg, this.getDefaultCfg(), cfg); // Element.CFG不合并，提升性能 合并默认配置，用户配置->继承默认配置->Element默认配置

  this.initAttrs(this._cfg.attrs); // 初始化绘图属性

  this._cfg.attrs = {};
  this.initTransform(); // 初始化变换

  this.init(); // 类型初始化
};

Element.CFG = {
  /**
   * 唯一标示
   * @type {Number}
   */
  id: null,

  /**
   * Z轴的层叠关系，Z值越大离用户越近
   * @type {Number}
   */
  zIndex: 0,

  /**
   * Canvas对象
   * @type: {Object}
   */
  canvas: null,

  /**
   * 父元素指针
   * @type {Object}
   */
  parent: null,

  /**
   * 用来设置当前对象是否能被捕捉
   * true 能
   * false 不能
   * 对象默认是都可以被捕捉的, 当capture为false时，group.getShape(x, y)方法无法获得该元素
   * 通过将不必要捕捉的元素的该属性设置成false, 来提高捕捉性能
   * @type {Boolean}
   **/
  capture: true,

  /**
   * 画布的上下文
   * @type {Object}
   */
  context: null,

  /**
   * 是否显示
   * @type {Boolean}
   */
  visible: true,

  /**
   * 是否被销毁
   * @type: {Boolean}
   */
  destroyed: false
};
Util.augment(Element, Attribute, Transform, EventEmitter, Animate, {
  init: function init() {
    this.setSilent('animable', true);
    this.setSilent('animating', false); // 初始时不处于动画状态
  },
  getParent: function getParent() {
    return this._cfg.parent;
  },

  /**
   * 获取默认的配置信息
   * @protected
   * @return {Object} 默认的属性
   */
  getDefaultCfg: function getDefaultCfg() {
    return {};
  },
  set: function set(name, value) {
    if (name === 'zIndex' && this._beforeSetZIndex) {
      this._beforeSetZIndex(value);
    }

    if (name === 'loading' && this._beforeSetLoading) {
      this._beforeSetLoading(value);
    }

    this._cfg[name] = value;
    return this;
  },
  // deprecated
  setSilent: function setSilent(name, value) {
    this._cfg[name] = value;
  },
  get: function get(name) {
    return this._cfg[name];
  },
  show: function show() {
    this._cfg.visible = true;
    return this;
  },
  hide: function hide() {
    this._cfg.visible = false;
    return this;
  },
  remove: function remove(destroy, delayRemove) {
    var cfg = this._cfg;
    var parent = cfg.parent;
    var el = cfg.el;

    if (parent) {
      Util.remove(parent.get('children'), this);
    }

    if (el) {
      if (delayRemove) {
        parent && parent._cfg.tobeRemoved.push(el);
      } else {
        el.parentNode.removeChild(el);
      }
    }

    if (destroy || destroy === undefined) {
      this.destroy();
    }

    return this;
  },
  destroy: function destroy() {
    var destroyed = this.get('destroyed');

    if (destroyed) {
      return;
    }

    this._attrs = null;
    this.removeEvent(); // 移除所有的事件

    this._cfg = {
      destroyed: true
    };
  },
  toFront: function toFront() {
    var cfg = this._cfg;
    var parent = cfg.parent;

    if (!parent) {
      return;
    }

    var children = parent._cfg.children;
    var el = cfg.el;
    var index = children.indexOf(this);
    children.splice(index, 1);
    children.push(this);

    if (el) {
      el.parentNode.removeChild(el);
      cfg.el = null;
    }
  },
  toBack: function toBack() {
    var cfg = this._cfg;
    var parent = cfg.parent;

    if (!parent) {
      return;
    }

    var children = parent._cfg.children;
    var el = cfg.el;
    var index = children.indexOf(this);
    children.splice(index, 1);
    children.unshift(this);

    if (el) {
      var parentNode = el.parentNode;
      parentNode.removeChild(el);
      parentNode.insertBefore(el, parentNode.firstChild);
    }
  },
  _beforeSetZIndex: function _beforeSetZIndex(zIndex) {
    var parent = this._cfg.parent;
    this._cfg.zIndex = zIndex;

    if (!Util.isNil(parent)) {
      parent.sort();
    }

    var el = this._cfg.el;

    if (el) {
      var children = parent._cfg.children;
      var index = children.indexOf(this);
      var parentNode = el.parentNode;
      parentNode.removeChild(el);

      if (index === children.length - 1) {
        parentNode.appendChild(el);
      } else {
        parentNode.insertBefore(el, parentNode.childNodes[index]);
      }
    }

    return zIndex;
  },
  _setAttrs: function _setAttrs(attrs) {
    this.attr(attrs);
    return attrs;
  },
  setZIndex: function setZIndex(zIndex) {
    this._cfg.zIndex = zIndex;
    return this._beforeSetZIndex(zIndex);
  },
  clone: function clone() {
    return Util.clone(this);
  },
  getBBox: function getBBox() {}
});
module.exports = Element;