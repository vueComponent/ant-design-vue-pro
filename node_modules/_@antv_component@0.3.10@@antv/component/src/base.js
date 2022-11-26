/**
 * @fileOverview Chart、View、Geometry 的基类
 * @author dxq613@gmail.com
 */

const EventEmitter = require('wolfy87-eventemitter');
const Util = require('./util');

class Base extends EventEmitter {
  getDefaultCfg() {
    return {};
  }

  constructor(cfg) {
    super();
    const self = this;
    const attrs = {
      visible: true
    };
    const defaultCfg = self.getDefaultCfg();
    self._attrs = attrs;
    Util.deepMix(attrs, defaultCfg, cfg);
  }

  get(name) {
    return this._attrs[name];
  }

  set(name, value) {
    this._attrs[name] = value;
  }

  /**
   * @protected
   * @param {Boolean} visible 是否可见
   * 显示、隐藏
   */
  changeVisible(/* visible */) {
  }

  destroy() {
    const self = this;
    self._attrs = {};
    self.removeAllListeners();
    self.destroyed = true;
  }
}

module.exports = Base;
