const Util = require('../util/index');
const Element = require('./element');
const Shape = require('../shapes/index');
const SHAPE_MAP = {}; // 缓存图形类型
const INDEX = '_INDEX';

function getComparer(compare) {
  return function(left, right) {
    const result = compare(left, right);
    return result === 0 ? left[INDEX] - right[INDEX] : result;
  };
}

function find(children, x, y) {
  let rst;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (child._cfg.visible && child._cfg.capture) {
      if (child.isGroup) {
        rst = child.getShape(x, y);
      } else if (child.isHit(x, y)) {
        rst = child;
      }
    }
    if (rst) {
      break;
    }
  }
  return rst;
}

const Group = function(cfg) {
  Group.superclass.constructor.call(this, cfg);
  this.set('children', []);
  this.set('tobeRemoved', []);

  this._beforeRenderUI();
  this._renderUI();
  this._bindUI();
};

function initClassCfgs(c) {
  if (c._cfg || c === Group) {
    return;
  }
  const superCon = c.superclass.constructor;
  if (superCon && !superCon._cfg) {
    initClassCfgs(superCon);
  }
  c._cfg = {};

  Util.merge(c._cfg, superCon._cfg);
  Util.merge(c._cfg, c.CFG);
}

Util.extend(Group, Element);

Util.augment(Group, {
  isGroup: true,
  type: 'group',
  canFill: true,
  canStroke: true,
  getDefaultCfg() {
    initClassCfgs(this.constructor);
    return Util.merge({}, this.constructor._cfg);
  },
  _beforeRenderUI() {},
  _renderUI() {},
  _bindUI() {},
  addShape(type, cfg) {
    const canvas = this.get('canvas');
    cfg = cfg || {};
    let shapeType = SHAPE_MAP[type];
    if (!shapeType) {
      shapeType = Util.upperFirst(type);
      SHAPE_MAP[type] = shapeType;
    }
    if (cfg.attrs && canvas) {
      const attrs = cfg.attrs;
      if (type === 'text') { // 临时解决
        const topFontFamily = canvas.get('fontFamily');
        if (topFontFamily) {
          attrs.fontFamily = attrs.fontFamily ? attrs.fontFamily : topFontFamily;
        }
      }
    }
    cfg.canvas = canvas;
    cfg.type = type;
    const rst = new Shape[shapeType](cfg);
    this.add(rst);
    return rst;
  },
  /** 添加图组
   * @param  {Function|Object|undefined} param 图组类
   * @param  {Object} cfg 配置项
   * @return {Object} rst 图组
   */
  addGroup(param, cfg) {
    const canvas = this.get('canvas');
    let rst;
    cfg = Util.merge({}, cfg);
    if (Util.isFunction(param)) {
      if (cfg) {
        cfg.canvas = canvas;
        cfg.parent = this;
        rst = new param(cfg);
      } else {
        rst = new param({
          canvas,
          parent: this
        });
      }
      this.add(rst);
    } else if (Util.isObject(param)) {
      param.canvas = canvas;
      rst = new Group(param);
      this.add(rst);
    } else if (param === undefined) {
      rst = new Group();
      this.add(rst);
    } else {
      return false;
    }
    return rst;
  },
  /** 绘制背景
   * @param  {Array} padding 内边距
   * @param  {Attrs} attrs 图形属性
   * @param  {Shape} backShape 背景图形
   * @return {Object} 背景层对象
   */
  renderBack(padding, attrs) {
    let backShape = this.get('backShape');
    const innerBox = this.getBBox();
    // const parent = this.get('parent'); // getParent
    Util.merge(attrs, {
      x: innerBox.minX - padding[3],
      y: innerBox.minY - padding[0],
      width: innerBox.width + padding[1] + padding[3],
      height: innerBox.height + padding[0] + padding[2]
    });
    if (backShape) {
      backShape.attr(attrs);
    } else {
      backShape = this.addShape('rect', {
        zIndex: -1,
        attrs
      });
    }
    this.set('backShape', backShape);
    this.sort();
    return backShape;
  },
  removeChild(item, destroy) {
    if (arguments.length >= 2) {
      if (this.contain(item)) {
        item.remove(destroy);
      }
    } else {
      if (arguments.length === 1) {
        if (Util.isBoolean(item)) {
          destroy = item;
        } else {
          if (this.contain(item)) {
            item.remove(true);
          }
          return this;
        }
      }
      if (arguments.length === 0) {
        destroy = true;
      }

      Group.superclass.remove.call(this, destroy);
    }
    return this;
  },
  /**
   * 向组中添加shape或者group
   * @param {Object} items 图形或者分组
   * @return {Object} group 本尊
   */
  add(items) {
    const self = this;
    const children = self.get('children');
    if (Util.isArray(items)) {
      Util.each(items, function(item) {
        const parent = item.get('parent');
        if (parent) {
          parent.removeChild(item, false);
        }
        self._setCfgProperty(item);
      });
      self._cfg.children = children.concat(items);
    } else {
      const item = items;
      const parent = item.get('parent');
      if (parent) {
        parent.removeChild(item, false);
      }
      self._setCfgProperty(item);
      children.push(item);
    }
    return self;
  },
  _setCfgProperty(item) {
    const cfg = this._cfg;
    item.set('parent', this);
    item.set('canvas', cfg.canvas);
    if (cfg.timeline) {
      item.set('timeline', cfg.timeline);
    }
  },
  contain(item) {
    const children = this.get('children');
    return children.indexOf(item) > -1;
  },
  getChildByIndex(index) {
    const children = this.get('children');
    return children[index];
  },
  getFirst() {
    return this.getChildByIndex(0);
  },
  getLast() {
    const lastIndex = this.get('children').length - 1;
    return this.getChildByIndex(lastIndex);
  },
  getBBox() {
    const self = this;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const children = self.get('children');
    if (children.length > 0) {
      Util.each(children, function(child) {
        if (child.get('visible')) {
          if (child.isGroup && child.get('children').length === 0) {
            return;
          }
          const box = child.getBBox();
          if (!box) {
            return true;
          }
          const leftTop = [ box.minX, box.minY, 1 ];
          const leftBottom = [ box.minX, box.maxY, 1 ];
          const rightTop = [ box.maxX, box.minY, 1 ];
          const rightBottom = [ box.maxX, box.maxY, 1 ];

          child.apply(leftTop);
          child.apply(leftBottom);
          child.apply(rightTop);
          child.apply(rightBottom);

          const boxMinX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
          const boxMaxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
          const boxMinY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);
          const boxMaxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);

          if (boxMinX < minX) {
            minX = boxMinX;
          }

          if (boxMaxX > maxX) {
            maxX = boxMaxX;
          }

          if (boxMinY < minY) {
            minY = boxMinY;
          }

          if (boxMaxY > maxY) {
            maxY = boxMaxY;
          }
        }
      });
    } else {
      minX = 0;
      maxX = 0;
      minY = 0;
      maxY = 0;
    }

    const box = {
      minX,
      minY,
      maxX,
      maxY
    };
    box.x = box.minX;
    box.y = box.minY;
    box.width = box.maxX - box.minX;
    box.height = box.maxY - box.minY;
    return box;
  },
  getCount() {
    return this.get('children').length;
  },
  sort() {
    const children = this.get('children');
    // 稳定排序
    Util.each(children, (child, index) => {
      child[INDEX] = index;
      return child;
    });

    children.sort(getComparer(function(obj1, obj2) {
      return obj1.get('zIndex') - obj2.get('zIndex');
    }));

    return this;
  },
  findById(id) {
    return this.find(function(item) {
      return item.get('id') === id;
    });
  },
  /**
   * 根据查找函数查找分组或者图形
   * @param  {Function} fn 匹配函数
   * @return {Canvas.Base} 分组或者图形
   */
  find(fn) {
    if (Util.isString(fn)) {
      return this.findById(fn);
    }
    const children = this.get('children');
    let rst = null;

    Util.each(children, function(item) {
      if (fn(item)) {
        rst = item;
      } else if (item.find) {
        rst = item.find(fn);
      }
      if (rst) {
        return false;
      }
    });
    return rst;
  },
  /**
   * @param  {Function} fn filter mathod
   * @return {Array} all the matching shapes and groups
   */
  findAll(fn) {
    const children = this.get('children');
    let rst = [];
    let childRst = [];
    Util.each(children, function(item) {
      if (fn(item)) {
        rst.push(item);
      }
      if (item.findAllBy) {
        childRst = item.findAllBy(fn);
        rst = rst.concat(childRst);
      }
    });
    return rst;
  },
  /**
   * @Deprecated
   * @param  {Function} fn filter method
   * @return {Object} found shape or group
   */
  findBy(fn) {
    const children = this.get('children');
    let rst = null;

    Util.each(children, function(item) {
      if (fn(item)) {
        rst = item;
      } else if (item.findBy) {
        rst = item.findBy(fn);
      }
      if (rst) {
        return false;
      }
    });
    return rst;
  },
  /**
   * @Deprecated
   * @param  {Function} fn filter mathod
   * @return {Array} all the matching shapes and groups
   */
  findAllBy(fn) {
    const children = this.get('children');
    let rst = [];
    let childRst = [];
    Util.each(children, function(item) {
      if (fn(item)) {
        rst.push(item);
      }
      if (item.findAllBy) {
        childRst = item.findAllBy(fn);
        rst = rst.concat(childRst);
      }
    });
    return rst;
  },
  getShape(x, y) {
    const self = this;
    const clip = self._attrs.clip;
    const children = self._cfg.children;
    let rst;
    if (clip) {
      const v = [ x, y, 1 ];
      clip.invert(v, self.get('canvas')); // 已经在外面转换
      if (clip.isPointInPath(v[0], v[1])) {
        rst = find(children, x, y);
      }
    } else {
      rst = find(children, x, y);
    }
    return rst;
  },
  clearTotalMatrix() {
    const m = this.get('totalMatrix');
    if (m) {
      this.setSilent('totalMatrix', null);
      const children = this._cfg.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.clearTotalMatrix();
      }
    }
  },
  clear(delayRemove) {
    const children = this._cfg.children;
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].remove(true, delayRemove);
    }
    this._cfg.children = [];
    return this;
  },
  destroy() {
    if (this.get('destroyed')) {
      return;
    }
    this.clear();
    Group.superclass.destroy.call(this);
  },
  clone() {
    const self = this;
    const children = self._cfg.children;
    const clone = new Group();
    Util.each(children, child => {
      clone.add(child.clone());
    });
    return clone;
  }
});

module.exports = Group;
