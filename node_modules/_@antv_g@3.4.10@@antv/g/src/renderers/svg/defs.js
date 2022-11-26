/**
 * Created by Elaine on 2018/5/9.
 */
const Util = require('../../util/index');
const Gradient = require('./defs/gradient');
const Shadow = require('./defs/shadow');
const Arrow = require('./defs/arrow');
const Clip = require('./defs/clip');
const Pattern = require('./defs/pattern');

class Defs {
  constructor(canvas) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const id = Util.uniqueId('defs_');
    el.id = id;
    canvas.appendChild(el);
    this.children = [];
    this.defaultArrow = {};
    this.el = el;
    this.canvas = canvas;
  }
  find(type, attr) {
    const children = this.children;
    let result = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i].match(type, attr)) {
        result = children[i].id;
        break;
      }
    }
    return result;
  }
  findById(id) {
    const children = this.children;
    let flag = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === id) {
        flag = children[i];
        break;
      }
    }
    return flag;
  }
  add(item) {
    this.children.push(item);
    item.canvas = this.canvas;
    item.parent = this;
  }
  getDefaultArrow(attrs, name) {
    const stroke = attrs.stroke || attrs.strokeStyle;
    if (this.defaultArrow[stroke]) {
      return this.defaultArrow[stroke].id;
    }
    const arrow = new Arrow(attrs, name);
    this.defaultArrow[stroke] = arrow;
    this.el.appendChild(arrow.el);
    return arrow.id;
  }
  addGradient(cfg) {
    const gradient = new Gradient(cfg);
    this.el.appendChild(gradient.el);
    this.add(gradient);
    return gradient.id;
  }
  addArrow(attrs, name) {
    const arrow = new Arrow(attrs, name);
    this.el.appendChild(arrow.el);
    return arrow.id;
  }
  addShadow(cfg) {
    const shadow = new Shadow(cfg);
    this.el.appendChild(shadow.el);
    this.add(shadow);
    return shadow.id;
  }
  addPattern(cfg) {
    const pattern = new Pattern(cfg);
    this.el.appendChild(pattern.el);
    this.add(pattern);
    return pattern.id;
  }
  addClip(cfg) {
    const clip = new Clip(cfg);
    this.el.appendChild(clip.el);
    this.add(clip);
    return clip.id;
  }
}

module.exports = Defs;
