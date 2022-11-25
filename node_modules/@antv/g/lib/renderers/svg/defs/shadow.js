/**
 * Created by Elaine on 2018/5/10.
 */
var Util = require('../../../util/index');

var ATTR_MAP = {
  shadowColor: 'color',
  shadowOpacity: 'opacity',
  shadowBlur: 'blur',
  shadowOffsetX: 'dx',
  shadowOffsetY: 'dy'
};
var SHADOW_DIMENSION = {
  x: '-40%',
  y: '-40%',
  width: '200%',
  height: '200%'
};

var Shadow = /*#__PURE__*/function () {
  function Shadow(cfg) {
    this.type = 'filter';
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); // expand the filter region to fill in shadows

    Util.each(SHADOW_DIMENSION, function (v, k) {
      el.setAttribute(k, v);
    });
    this.el = el;
    this.id = Util.uniqueId('filter_');
    this.el.id = this.id;
    this.cfg = cfg;

    this._parseShadow(cfg, el);

    return this;
  }

  var _proto = Shadow.prototype;

  _proto.match = function match(type, cfg) {
    if (this.type !== type) {
      return false;
    }

    var flag = true;
    var config = this.cfg;
    Util.each(Object.keys(config), function (attr) {
      if (config[attr] !== cfg[attr]) {
        flag = false;
        return false;
      }
    });
    return flag;
  };

  _proto.update = function update(name, value) {
    var config = this.cfg;
    config[ATTR_MAP[name]] = value;

    this._parseShadow(config, this.el);

    return this;
  };

  _proto._parseShadow = function _parseShadow(config, el) {
    var child = "<feDropShadow \n      dx=\"" + (config.dx || 0) + "\" \n      dy=\"" + (config.dy || 0) + "\" \n      stdDeviation=\"" + (config.blur ? config.blur / 10 : 0) + "\"\n      flood-color=\"" + (config.color ? config.color : '#000') + "\"\n      flood-opacity=\"" + (config.opacity ? config.opacity : 1) + "\"\n      />";
    el.innerHTML = child;
  };

  return Shadow;
}();

module.exports = Shadow;