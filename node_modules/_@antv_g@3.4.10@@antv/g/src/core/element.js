const Util = require('../util/index');
const Attribute = require('./mixin/attribute');
const Transform = require('./mixin/transform');
const Animate = require('./mixin/animation');
const EventEmitter = require('./advanced-event-emitter');

const Element = function(cfg) {
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
  init() {
    this.setSilent('animable', true);
    this.setSilent('animating', false); // 初始时不处于动画状态
  },
  getParent() {
    return this._cfg.parent;
  },
  /**
   * 获取默认的配置信息
   * @protected
   * @return {Object} 默认的属性
   */
  getDefaultCfg() {
    return {};
  },
  set(name, value) {
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
  setSilent(name, value) {
    this._cfg[name] = value;
  },
  get(name) {
    return this._cfg[name];
  },
  show() {
    this._cfg.visible = true;
    return this;
  },
  hide() {
    this._cfg.visible = false;
    return this;
  },
  remove(destroy, delayRemove) {
    const cfg = this._cfg;
    const parent = cfg.parent;
    const el = cfg.el;
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
  destroy() {
    const destroyed = this.get('destroyed');
    if (destroyed) {
      return;
    }
    this._attrs = null;
    this.removeEvent(); // 移除所有的事件
    this._cfg = {
      destroyed: true
    };
  },
  toFront() {
    const cfg = this._cfg;
    const parent = cfg.parent;
    if (!parent) {
      return;
    }
    const children = parent._cfg.children;
    const el = cfg.el;
    const index = children.indexOf(this);
    children.splice(index, 1);
    children.push(this);
    if (el) {
      el.parentNode.removeChild(el);
      cfg.el = null;
    }
  },
  toBack() {
    const cfg = this._cfg;
    const parent = cfg.parent;
    if (!parent) {
      return;
    }
    const children = parent._cfg.children;
    const el = cfg.el;
    const index = children.indexOf(this);
    children.splice(index, 1);
    children.unshift(this);
    if (el) {
      const parentNode = el.parentNode;
      parentNode.removeChild(el);
      parentNode.insertBefore(el, parentNode.firstChild);
    }
  },
  _beforeSetZIndex(zIndex) {
    const parent = this._cfg.parent;
    this._cfg.zIndex = zIndex;
    if (!Util.isNil(parent)) {
      parent.sort();
    }
    const el = this._cfg.el;
    if (el) {
      const children = parent._cfg.children;
      const index = children.indexOf(this);
      const parentNode = el.parentNode;
      parentNode.removeChild(el);
      if (index === children.length - 1) {
        parentNode.appendChild(el);
      } else {
        parentNode.insertBefore(el, parentNode.childNodes[index]);
      }
    }
    return zIndex;
  },
  _setAttrs(attrs) {
    this.attr(attrs);
    return attrs;
  },
  setZIndex(zIndex) {
    this._cfg.zIndex = zIndex;
    return this._beforeSetZIndex(zIndex);
  },
  clone() {
    return Util.clone(this);
  },
  getBBox() {}
});

module.exports = Element;
