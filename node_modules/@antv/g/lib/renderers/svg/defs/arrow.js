/**
 * Created by Elaine on 2018/5/11.
 */
var Util = require('../../../util/index');

var Arrow = /*#__PURE__*/function () {
  function Arrow(attrs, type) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    var id = Util.uniqueId('marker_');
    el.setAttribute('id', id);
    var shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('stroke', 'none');
    shape.setAttribute('fill', attrs.stroke || '#000');
    el.appendChild(shape);
    el.setAttribute('overflow', 'visible');
    el.setAttribute('orient', 'auto-start-reverse');
    this.el = el;
    this.child = shape;
    this.id = id;
    this.cfg = attrs[type === 'marker-start' ? 'startArrow' : 'endArrow'];
    this.stroke = attrs.stroke || '#000';

    if (this.cfg === true) {
      this._setDefaultPath(type, shape);
    } else {
      this._setMarker(attrs.lineWidth, shape);
    }

    return this;
  }

  var _proto = Arrow.prototype;

  _proto.match = function match() {
    return false;
  };

  _proto._setDefaultPath = function _setDefaultPath(type, el) {
    var parent = this.el;
    el.setAttribute('d', 'M0,0 L6,3 L0,6 L3,3Z');
    parent.setAttribute('refX', 3);
    parent.setAttribute('refY', 3);
  };

  _proto._setMarker = function _setMarker(r, el) {
    var parent = this.el;
    var path = this.cfg.path;
    var d = this.cfg.d;

    if (Util.isArray(path)) {
      path = path.map(function (segment) {
        return segment.join(' ');
      }).join('');
    }

    el.setAttribute('d', path);
    parent.appendChild(el);

    if (d) {
      parent.setAttribute('refX', d / r);
    }
  };

  _proto.update = function update(fill) {
    var child = this.child;

    if (child.attr) {
      child.attr('fill', fill);
    } else {
      child.setAttribute('fill', fill);
    }
  };

  return Arrow;
}();

module.exports = Arrow;