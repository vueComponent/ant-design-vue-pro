const Util = require('../../util/index');

module.exports = {
  canFill: false,
  canStroke: false,
  initAttrs(attrs) {
    this._attrs = {
      opacity: 1,
      fillOpacity: 1,
      strokeOpacity: 1,
      matrix: [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]
    };
    this.attr(Util.assign(this.getDefaultAttrs(), attrs));
    return this;
  },
  getDefaultAttrs() {
    return {};
  },
  /**
   * 设置或者设置属性，有以下 4 种情形：
   *   - name 不存在, 则返回属性集合
   *   - name 为字符串，value 为空，获取属性值
   *   - name 为字符串，value 不为空，设置属性值，返回 this
   *   - name 为键值对，value 为空，设置属性值
   *
   * @param  {String | Object} name  属性名
   * @param  {*} value 属性值
   * @return {*} 属性值
   */
  attr(name, value) {
    const self = this;
    if (arguments.length === 0) {
      return self._attrs;
    }
    if (Util.isObject(name)) {
      // self._attrs = Util.deepMix(self._attrs, name);
      for (const k in name) {
        this._setAttr(k, name[k]);
      }
      self.clearBBox();
      this._cfg.hasUpdate = true;
      return self;
    }
    if (arguments.length === 2) {
      this._setAttr(name, value);
      self.clearBBox();
      this._cfg.hasUpdate = true;
      return self;
    }
    return self._attrs[name];
  },
  _setAttr(name, value) {
    const self = this;
    const attrs = this._attrs;
    attrs[name] = value;
    if (name === 'fill' || name === 'stroke') {
      attrs[name + 'Style'] = value;
      return;
    }
    if (name === 'opacity') {
      attrs.globalAlpha = value;
      return;
    }
    if (name === 'clip' && value) {
      self._setClip(value);
      return;
    }
    if (name === 'path' && self._afterSetAttrPath) {
      self._afterSetAttrPath(value);
      return;
    }
    if (name === 'transform') {
      self.transform(value);
      return;
    }
    if (name === 'rotate') {
      self.rotateAtStart(value);
    }
  },
  clearBBox() {
    this.setSilent('box', null);
  },
  hasFill() {
    return this.canFill && this._attrs.fillStyle;
  },
  hasStroke() {
    return this.canStroke && this._attrs.strokeStyle;
  },
  _setClip(item) {
    item._cfg.renderer = this._cfg.renderer;
    item._cfg.canvas = this._cfg.canvas;
    item._cfg.parent = this._cfg.parent;
    item.hasFill = function() { return true; };
  }
};
