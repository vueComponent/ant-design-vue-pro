/**
 * Created by Elaine on 2018/5/10.
 */
const Util = require('../../../util/index');

const ATTR_MAP = {
  shadowColor: 'color',
  shadowOpacity: 'opacity',
  shadowBlur: 'blur',
  shadowOffsetX: 'dx',
  shadowOffsetY: 'dy'
};

const SHADOW_DIMENSION = {
  x: '-40%',
  y: '-40%',
  width: '200%',
  height: '200%'

};

class Shadow {
  constructor(cfg) {
    this.type = 'filter';
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    // expand the filter region to fill in shadows
    Util.each(SHADOW_DIMENSION, function(v, k) {
      el.setAttribute(k, v);
    });
    this.el = el;
    this.id = Util.uniqueId('filter_');
    this.el.id = this.id;
    this.cfg = cfg;
    this._parseShadow(cfg, el);
    return this;
  }
  match(type, cfg) {
    if (this.type !== type) {
      return false;
    }
    let flag = true;
    const config = this.cfg;
    Util.each(Object.keys(config), attr => {
      if (config[attr] !== cfg[attr]) {
        flag = false;
        return false;
      }
    });
    return flag;
  }
  update(name, value) {
    const config = this.cfg;
    config[ATTR_MAP[name]] = value;
    this._parseShadow(config, this.el);
    return this;
  }
  _parseShadow(config, el) {
    const child = `<feDropShadow 
      dx="${config.dx || 0}" 
      dy="${config.dy || 0}" 
      stdDeviation="${config.blur ? config.blur / 10 : 0}"
      flood-color="${config.color ? config.color : '#000'}"
      flood-opacity="${config.opacity ? config.opacity : 1}"
      />`;
    el.innerHTML = child;
  }
}

module.exports = Shadow;

