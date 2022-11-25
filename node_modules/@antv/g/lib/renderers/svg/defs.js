/**
 * Created by Elaine on 2018/5/9.
 */
var Util = require('../../util/index');

var Gradient = require('./defs/gradient');

var Shadow = require('./defs/shadow');

var Arrow = require('./defs/arrow');

var Clip = require('./defs/clip');

var Pattern = require('./defs/pattern');

var Defs = /*#__PURE__*/function () {
  function Defs(canvas) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var id = Util.uniqueId('defs_');
    el.id = id;
    canvas.appendChild(el);
    this.children = [];
    this.defaultArrow = {};
    this.el = el;
    this.canvas = canvas;
  }

  var _proto = Defs.prototype;

  _proto.find = function find(type, attr) {
    var children = this.children;
    var result = null;

    for (var i = 0; i < children.length; i++) {
      if (children[i].match(type, attr)) {
        result = children[i].id;
        break;
      }
    }

    return result;
  };

  _proto.findById = function findById(id) {
    var children = this.children;
    var flag = null;

    for (var i = 0; i < children.length; i++) {
      if (children[i].id === id) {
        flag = children[i];
        break;
      }
    }

    return flag;
  };

  _proto.add = function add(item) {
    this.children.push(item);
    item.canvas = this.canvas;
    item.parent = this;
  };

  _proto.getDefaultArrow = function getDefaultArrow(attrs, name) {
    var stroke = attrs.stroke || attrs.strokeStyle;

    if (this.defaultArrow[stroke]) {
      return this.defaultArrow[stroke].id;
    }

    var arrow = new Arrow(attrs, name);
    this.defaultArrow[stroke] = arrow;
    this.el.appendChild(arrow.el);
    return arrow.id;
  };

  _proto.addGradient = function addGradient(cfg) {
    var gradient = new Gradient(cfg);
    this.el.appendChild(gradient.el);
    this.add(gradient);
    return gradient.id;
  };

  _proto.addArrow = function addArrow(attrs, name) {
    var arrow = new Arrow(attrs, name);
    this.el.appendChild(arrow.el);
    return arrow.id;
  };

  _proto.addShadow = function addShadow(cfg) {
    var shadow = new Shadow(cfg);
    this.el.appendChild(shadow.el);
    this.add(shadow);
    return shadow.id;
  };

  _proto.addPattern = function addPattern(cfg) {
    var pattern = new Pattern(cfg);
    this.el.appendChild(pattern.el);
    this.add(pattern);
    return pattern.id;
  };

  _proto.addClip = function addClip(cfg) {
    var clip = new Clip(cfg);
    this.el.appendChild(clip.el);
    this.add(clip);
    return clip.id;
  };

  return Defs;
}();

module.exports = Defs;