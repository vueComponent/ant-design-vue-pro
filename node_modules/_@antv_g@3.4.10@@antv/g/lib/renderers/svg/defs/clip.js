/**
 * Created by Elaine on 2018/5/14.
 */
var Util = require('../../../util/index');

var Clip = /*#__PURE__*/function () {
  function Clip(cfg) {
    this.type = 'clip';
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    this.el = el;
    this.id = Util.uniqueId('clip_');
    el.id = this.id;
    var shapeEl = cfg._cfg.el; // just in case the clip shape is also a shape needs to be drawn

    el.appendChild(shapeEl.cloneNode(true));
    this.cfg = cfg;
    return this;
  }

  var _proto = Clip.prototype;

  _proto.match = function match() {
    return false;
  };

  _proto.remove = function remove() {
    var el = this.el;
    el.parentNode.removeChild(el);
  };

  return Clip;
}();

module.exports = Clip;