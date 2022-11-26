var Util = require('../../util');

var _require = require('../../util/format'),
    parseRadius = _require.parseRadius;

var Marker = require('../../shapes/marker');

var Defs = require('./defs');

var SHAPE_TO_TAGS = {
  rect: 'path',
  circle: 'circle',
  line: 'line',
  path: 'path',
  marker: 'path',
  text: 'text',
  polygon: 'polygon',
  image: 'image',
  ellipse: 'ellipse',
  dom: 'foreignObject',
  fan: 'path',
  group: 'g'
};
var LETTER_SPACING = 0.3;
var SVG_ATTR_MAP = {
  opacity: 'opacity',
  fillStyle: 'fill',
  strokeOpacity: 'stroke-opacity',
  fillOpacity: 'fill-opacity',
  strokeStyle: 'stroke',
  x: 'x',
  y: 'y',
  r: 'r',
  width: 'width',
  height: 'height',
  x1: 'x1',
  x2: 'x2',
  y1: 'y1',
  y2: 'y2',
  lineCap: 'stroke-linecap',
  lineJoin: 'stroke-linejoin',
  lineWidth: 'stroke-width',
  lineDash: 'stroke-dasharray',
  lineDashOffset: 'stroke-dashoffset',
  miterLimit: 'stroke-miterlimit',
  font: 'font',
  fontSize: 'font-size',
  fontStyle: 'font-style',
  fontVariant: 'font-variant',
  fontWeight: 'font-weight',
  fontFamily: 'font-family',
  startArrow: 'marker-start',
  endArrow: 'marker-end',
  path: 'd',
  class: 'class',
  id: 'id',
  style: 'style',
  preserveAspectRatio: 'preserveAspectRatio'
};
var BASELINE_MAP = {
  top: 'before-edge',
  middle: 'central',
  bottom: 'after-edge',
  alphabetic: 'baseline',
  hanging: 'hanging'
};
var ANCHOR_MAP = {
  left: 'left',
  start: 'left',
  center: 'middle',
  right: 'end',
  end: 'end'
};

var Painter =
/*#__PURE__*/
function () {
  function Painter(dom) {
    if (!dom) {
      return null;
    }

    var svgId = Util.uniqueId('canvas_');
    var canvasDom = Util.createDom("<svg id=\"" + svgId + "\"></svg>");
    dom.appendChild(canvasDom);
    this.type = 'svg';
    this.canvas = canvasDom;
    this.context = new Defs(canvasDom);
    this.toDraw = false;
    return this;
  }

  var _proto = Painter.prototype;

  _proto.draw = function draw(model) {
    var self = this;

    function drawInner() {
      self.animateHandler = Util.requestAnimationFrame(function () {
        self.animateHandler = undefined;

        if (self.toDraw) {
          drawInner();
        }
      });

      try {
        model.resetMatrix();

        self._drawGroup(model, false);
      } catch (ev) {
        // 绘制时异常，中断重绘
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);
        self.toDraw = false;
      }

      self.toDraw = false;
    }

    if (self.animateHandler) {
      self.toDraw = true;
    } else {
      drawInner();
    }
  };

  _proto.drawSync = function drawSync(model) {
    this._drawChildren(model, false);
  };

  _proto._drawGroup = function _drawGroup(model, redraw) {
    var cfg = model._cfg;

    if (cfg.removed || cfg.destroyed) {
      return;
    }
    /**
     * FIXME redraw: 为了使元素置顶的临时解决方案
     * 如果直接将dom元素重排可以解决部分问题。但是如果重排后的group中有新增的shape，置顶效果就没有了
     * 所以只能删除原有节点，新增节点以及所有子节点。这时候哪怕shape有el，也需要判断一下是否需要重绘
     */


    if (!cfg.el && cfg.attrs) {
      redraw = true;
    }

    if (cfg.tobeRemoved) {
      Util.each(cfg.tobeRemoved, function (item) {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      });
      cfg.tobeRemoved = [];
    }

    this._drawShape(model, redraw);

    if (cfg.children && cfg.children.length > 0) {
      this._drawChildren(model, redraw);
    }
  };

  _proto._drawChildren = function _drawChildren(parent, redraw) {
    var self = this;
    var children = parent._cfg.children;
    var shape; // 防止在画children的时候，父group已经被destroy

    if (!children) {
      return;
    }

    if (parent._cfg.el && !redraw) {
      // FIXME 这边是为了解决一个group中有元素已经生成el，还有一些没生成el时，没生成el的置底效果不work
      var childLen = parent._cfg.el.childNodes.length + 1;

      if (childLen !== 0 && childLen !== children.length) {
        redraw = true;
      }
    }

    for (var i = 0; i < children.length; i++) {
      shape = children[i];

      if (shape.isGroup) {
        self._drawGroup(shape, redraw);
      } else {
        self._drawShape(shape, redraw);
      }
    }
  };

  _proto._drawShape = function _drawShape(model, redraw) {
    var self = this;
    var attrs = model._attrs;
    var cfg = model._cfg;
    var el = cfg.el; // 删除

    if (cfg.removed || cfg.destroyed) {
      if (el) {
        el.parentNode.removeChild(cfg.el);
      }

      return;
    } // 重绘节点


    if (redraw && el) {
      el.parentNode && el.parentNode.removeChild(el);
      el = null;
    } // 新增节点


    if (!el && cfg.parent) {
      self._createDom(model);

      self._updateShape(model);
    }

    el = cfg.el;

    if (cfg.visible === false) {
      el.setAttribute('visibility', 'hidden');
      return;
    }

    if (cfg.visible && el.hasAttribute('visibility')) {
      el.removeAttribute('visibility');
    } // 更新


    if (cfg.hasUpdate) {
      self._updateShape(model);
    }

    if (attrs.clip && attrs.clip._cfg.hasUpdate) {
      self._updateShape(attrs.clip);
    }
  };

  _proto._updateShape = function _updateShape(model) {
    var self = this;
    var attrs = model._attrs;
    var formerAttrs = model._cfg.attrs;

    if (!formerAttrs) {
      return;
    }

    if (!model._cfg.el) {
      self._createDom(model);
    }

    if ('clip' in attrs) {
      this._setClip(model, attrs.clip);
    }

    if ('shadowOffsetX' in attrs || 'shadowOffsetY' in attrs || 'shadowBlur' in attrs || 'shadowColor' in attrs) {
      this._setShadow(model);
    }

    if (model.type === 'text') {
      self._updateText(model);

      return;
    }

    if (model.type === 'fan') {
      self._updateFan(model);
    }

    if (model.type === 'marker') {
      model._cfg.el.setAttribute('d', self._assembleMarker(attrs));
    }

    if (model.type === 'rect') {
      model._cfg.el.setAttribute('d', self._assembleRect(attrs));
    }

    for (var key in attrs) {
      if (attrs[key] !== formerAttrs[key]) {
        self._setAttribute(model, key, attrs[key]);
      }
    }

    model._cfg.attrs = Util.deepMix({}, model._attrs);
    model._cfg.hasUpdate = false;
  };

  _proto._setAttribute = function _setAttribute(model, name, value) {
    var type = model.type;
    var attrs = model._attrs;
    var el = model._cfg.el;
    var defs = this.context; // 计算marker路径

    if ((type === 'marker' || type === 'rect') && ~['x', 'y', 'radius', 'r'].indexOf(name)) {
      return;
    } // 圆和椭圆不是x, y， 是cx, cy。 marker的x,y 用于计算marker的路径，不需要写到dom


    if (~['circle', 'ellipse'].indexOf(type) && ~['x', 'y'].indexOf(name)) {
      el.setAttribute('c' + name, parseInt(value, 10));
      return;
    } // 多边形


    if (type === 'polygon' && name === 'points') {
      if (!value || value.length === 0) {
        value = '';
      }

      if (Util.isArray(value)) {
        value = value.map(function (point) {
          return point[0] + ',' + point[1];
        });
        value = value.join(' ');
      }

      el.setAttribute('points', value);
      return;
    } // 设置path


    if (name === 'path' && Util.isArray(value)) {
      el.setAttribute('d', this._formatPath(value));
      return;
    } // 设置图片


    if (name === 'img') {
      this._setImage(model, value);

      return;
    }

    if (name === 'transform') {
      if (!value) {
        el.removeAttribute('transform');
        return;
      }

      this._setTransform(model);

      return;
    }

    if (name === 'rotate') {
      if (!value) {
        el.removeAttribute('transform');
        return;
      }

      this._setTransform(model);

      return;
    }

    if (name === 'matrix') {
      this._setTransform(model);

      return;
    }

    if (name === 'fillStyle' || name === 'strokeStyle') {
      this._setColor(model, name, value);

      return;
    }

    if (name === 'clip') {
      return;
    }

    if (~name.indexOf('Arrow')) {
      name = SVG_ATTR_MAP[name];

      if (!value) {
        model._cfg[name] = null;
        el.removeAttribute(name);
      } else {
        var id = null;

        if (typeof value === 'boolean') {
          id = defs.getDefaultArrow(attrs, name);
        } else {
          id = defs.addArrow(attrs, name);
        }

        el.setAttribute(name, "url(#" + id + ")");
        model._cfg[name] = id;
      }

      return;
    } // foreignObject


    if (name === 'html') {
      if (typeof value === 'string') {
        el.innerHTML = value;
      } else {
        el.innerHTML = '';
        el.appendChild(value);
      }
    }

    if (SVG_ATTR_MAP[name]) {
      el.setAttribute(SVG_ATTR_MAP[name], value);
    }
  };

  _proto._createDom = function _createDom(model) {
    var type = SHAPE_TO_TAGS[model.type];
    var attrs = model._attrs;

    if (!type) {
      throw new Error('the type' + model.type + 'is not supported by svg');
    }

    var shape = document.createElementNS('http://www.w3.org/2000/svg', type);
    model._cfg.el = shape;

    if (model._cfg.parent) {
      model._cfg.parent.get('el').appendChild(shape);
    }

    model._cfg.attrs = {};

    if (model.type === 'text') {
      shape.setAttribute('paint-order', 'stroke');
      shape.setAttribute('style', 'stroke-linecap:butt; stroke-linejoin:miter;');
    } else {
      if (!attrs.stroke && !attrs.strokeStyle) {
        shape.setAttribute('stroke', 'none');
      }

      if (!attrs.fill && !attrs.fillStyle) {
        shape.setAttribute('fill', 'none');
      }
    }

    return shape;
  };

  _proto._assembleMarker = function _assembleMarker(attrs) {
    var r = attrs.r;

    if (typeof attrs.r === 'undefined') {
      r = attrs.radius;
    }

    if (isNaN(Number(attrs.x)) || isNaN(Number(attrs.y)) || isNaN(Number(r))) {
      return '';
    }

    var d = '';

    if (typeof attrs.symbol === 'function') {
      d = attrs.symbol(attrs.x, attrs.y, r);
    } else {
      d = Marker.Symbols[attrs.symbol || 'circle'](attrs.x, attrs.y, r);
    }

    if (Util.isArray(d)) {
      d = d.map(function (path) {
        return path.join(' ');
      }).join('');
    }

    return d;
  };

  _proto._assembleRect = function _assembleRect(attrs) {
    var x = attrs.x;
    var y = attrs.y;
    var w = attrs.width;
    var h = attrs.height;
    var radius = attrs.radius;

    if (!radius) {
      return "M " + x + "," + y + " l " + w + ",0 l 0," + h + " l" + -w + " 0 z";
    }

    var r = parseRadius(radius);

    if (Util.isArray(radius)) {
      if (radius.length === 1) {
        r.r1 = r.r2 = r.r3 = r.r4 = radius[0];
      } else if (radius.length === 2) {
        r.r1 = r.r3 = radius[0];
        r.r2 = r.r4 = radius[1];
      } else if (radius.length === 3) {
        r.r1 = radius[0];
        r.r2 = r.r4 = radius[1];
        r.r3 = radius[2];
      } else {
        r.r1 = radius[0];
        r.r2 = radius[1];
        r.r3 = radius[2];
        r.r4 = radius[3];
      }
    } else {
      r.r1 = r.r2 = r.r3 = r.r4 = radius;
    }

    var d = [["M " + (x + r.r1) + "," + y], ["l " + (w - r.r1 - r.r2) + ",0"], ["a " + r.r2 + "," + r.r2 + ",0,0,1," + r.r2 + "," + r.r2], ["l 0," + (h - r.r2 - r.r3)], ["a " + r.r3 + "," + r.r3 + ",0,0,1," + -r.r3 + "," + r.r3], ["l " + (r.r3 + r.r4 - w) + ",0"], ["a " + r.r4 + "," + r.r4 + ",0,0,1," + -r.r4 + "," + -r.r4], ["l 0," + (r.r4 + r.r1 - h)], ["a " + r.r1 + "," + r.r1 + ",0,0,1," + r.r1 + "," + -r.r1], ['z']];
    return d.join(' ');
  };

  _proto._formatPath = function _formatPath(value) {
    value = value.map(function (path) {
      return path.join(' ');
    }).join('');

    if (~value.indexOf('NaN')) {
      return '';
    }

    return value;
  };

  _proto._setTransform = function _setTransform(model) {
    var matrix = model._attrs.matrix;
    var el = model._cfg.el;
    var transform = [];

    for (var i = 0; i < 9; i += 3) {
      transform.push(matrix[i] + ',' + matrix[i + 1]);
    }

    transform = transform.join(',');

    if (transform.indexOf('NaN') === -1) {
      el.setAttribute('transform', "matrix(" + transform + ")");
    } else {
      console.warn('invalid matrix:', matrix);
    }
  };

  _proto._setImage = function _setImage(model, img) {
    var attrs = model._attrs;
    var el = model._cfg.el;

    if (Util.isString(img)) {
      el.setAttribute('href', img);
    } else if (img instanceof Image) {
      if (!attrs.width) {
        el.setAttribute('width', img.width);
        model._attrs.width = img.width;
      }

      if (!attrs.height) {
        el.setAttribute('height', img.height);
        model._attrs.height = img.height;
      }

      el.setAttribute('href', img.src);
    } else if (img instanceof HTMLElement && Util.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
      el.setAttribute('href', img.toDataURL());
    } else if (img instanceof ImageData) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', img.width);
      canvas.setAttribute('height', img.height);
      canvas.getContext('2d').putImageData(img, 0, 0);

      if (!attrs.width) {
        el.setAttribute('width', img.width);
        model._attrs.width = img.width;
      }

      if (!attrs.height) {
        el.setAttribute('height', img.height);
        model._attrs.height = img.height;
      }

      el.setAttribute('href', canvas.toDataURL());
    }
  };

  _proto._updateFan = function _updateFan(model) {
    function getPoint(angle, radius, center) {
      return {
        x: radius * Math.cos(angle) + center.x,
        y: radius * Math.sin(angle) + center.y
      };
    }

    var attrs = model._attrs;
    var cfg = model._cfg;
    var center = {
      x: attrs.x,
      y: attrs.y
    };
    var d = [];
    var startAngle = attrs.startAngle;
    var endAngle = attrs.endAngle;

    if (Util.isNumberEqual(endAngle - startAngle, Math.PI * 2)) {
      endAngle -= 0.00001;
    }

    var outerStart = getPoint(startAngle, attrs.re, center);
    var outerEnd = getPoint(endAngle, attrs.re, center);
    var fa = endAngle > startAngle ? 1 : 0;
    var fs = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    var rs = attrs.rs;
    var re = attrs.re;
    var innerStart = getPoint(startAngle, attrs.rs, center);
    var innerEnd = getPoint(endAngle, attrs.rs, center);

    if (attrs.rs > 0) {
      d.push("M " + outerEnd.x + "," + outerEnd.y);
      d.push("L " + innerEnd.x + "," + innerEnd.y);
      d.push("A " + rs + "," + rs + ",0," + fs + "," + (fa === 1 ? 0 : 1) + "," + innerStart.x + "," + innerStart.y);
      d.push("L " + outerStart.x + " " + outerStart.y);
    } else {
      d.push("M " + center.x + "," + center.y);
      d.push("L " + outerStart.x + "," + outerStart.y);
    }

    d.push("A " + re + "," + re + ",0," + fs + "," + fa + "," + outerEnd.x + "," + outerEnd.y);

    if (attrs.rs > 0) {
      d.push("L " + innerEnd.x + "," + innerEnd.y);
    } else {
      d.push('Z');
    }

    cfg.el.setAttribute('d', d.join(' '));
  };

  _proto._updateText = function _updateText(model) {
    var self = this;
    var attrs = model._attrs;
    var formerAttrs = model._cfg.attrs;
    var el = model._cfg.el;

    this._setFont(model);

    for (var attr in attrs) {
      if (attrs[attr] !== formerAttrs[attr]) {
        if (attr === 'text') {
          self._setText(model, "" + attrs[attr]);

          continue;
        }

        if (attr === 'fillStyle' || attr === 'strokeStyle') {
          this._setColor(model, attr, attrs[attr]);

          continue;
        }

        if (attr === 'matrix') {
          this._setTransform(model);

          continue;
        }

        if (SVG_ATTR_MAP[attr]) {
          el.setAttribute(SVG_ATTR_MAP[attr], attrs[attr]);
        }
      }
    }

    model._cfg.attrs = Object.assign({}, model._attrs);
    model._cfg.hasUpdate = false;
  };

  _proto._setFont = function _setFont(model) {
    var el = model.get('el');
    var attrs = model._attrs;
    var fontSize = attrs.fontSize;
    el.setAttribute('alignment-baseline', BASELINE_MAP[attrs.textBaseline] || 'baseline');
    el.setAttribute('text-anchor', ANCHOR_MAP[attrs.textAlign] || 'left');

    if (fontSize && +fontSize < 12) {
      // 小于 12 像素的文本进行 scale 处理
      attrs.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      model.transform([['t', -attrs.x, -attrs.y], ['s', +fontSize / 12, +fontSize / 12], ['t', attrs.x, attrs.y]]);
    }
  };

  _proto._setText = function _setText(model, text) {
    var el = model._cfg.el;
    var baseline = model._attrs.textBaseline || 'bottom';

    if (!text) {
      el.innerHTML = '';
    } else if (~text.indexOf('\n')) {
      var x = model._attrs.x;
      var textArr = text.split('\n');
      var textLen = textArr.length - 1;
      var arr = '';
      Util.each(textArr, function (segment, i) {
        if (i === 0) {
          if (baseline === 'alphabetic') {
            arr += "<tspan x=\"" + x + "\" dy=\"" + -textLen + "em\">" + segment + "</tspan>";
          } else if (baseline === 'top') {
            arr += "<tspan x=\"" + x + "\" dy=\"0.9em\">" + segment + "</tspan>";
          } else if (baseline === 'middle') {
            arr += "<tspan x=\"" + x + "\" dy=\"" + -(textLen - 1) / 2 + "em\">" + segment + "</tspan>";
          } else if (baseline === 'bottom') {
            arr += "<tspan x=\"" + x + "\" dy=\"-" + (textLen + LETTER_SPACING) + "em\">" + segment + "</tspan>";
          } else if (baseline === 'hanging') {
            arr += "<tspan x=\"" + x + "\" dy=\"" + (-(textLen - 1) - LETTER_SPACING) + "em\">" + segment + "</tspan>";
          }
        } else {
          arr += "<tspan x=\"" + x + "\" dy=\"1em\">" + segment + "</tspan>";
        }
      });
      el.innerHTML = arr;
    } else {
      el.innerHTML = text;
    }
  };

  _proto._setClip = function _setClip(model, value) {
    var el = model._cfg.el;

    if (!value) {
      el.removeAttribute('clip-path');
      return;
    }

    if (!el.hasAttribute('clip-path')) {
      this._createDom(value);

      this._updateShape(value);

      var id = this.context.addClip(value);
      el.setAttribute('clip-path', "url(#" + id + ")");
    } else if (value._cfg.hasUpdate) {
      this._updateShape(value);
    }
  };

  _proto._setColor = function _setColor(model, name, value) {
    var el = model._cfg.el;
    var defs = this.context;

    if (!value) {
      el.setAttribute(SVG_ATTR_MAP[name], 'none');
      return;
    }

    value = value.trim();

    if (/^[r,R,L,l]{1}[\s]*\(/.test(value)) {
      var id = defs.find('gradient', value);

      if (!id) {
        id = defs.addGradient(value);
      }

      el.setAttribute(SVG_ATTR_MAP[name], "url(#" + id + ")");
    } else if (/^[p,P]{1}[\s]*\(/.test(value)) {
      var _id = defs.find('pattern', value);

      if (!_id) {
        _id = defs.addPattern(value);
      }

      el.setAttribute(SVG_ATTR_MAP[name], "url(#" + _id + ")");
    } else {
      el.setAttribute(SVG_ATTR_MAP[name], value);
    }
  };

  _proto._setShadow = function _setShadow(model) {
    var el = model._cfg.el;
    var attrs = model._attrs;
    var cfg = {
      dx: attrs.shadowOffsetX,
      dy: attrs.shadowOffsetY,
      blur: attrs.shadowBlur,
      color: attrs.shadowColor
    };

    if (!cfg.dx && !cfg.dy && !cfg.blur && !cfg.color) {
      el.removeAttribute('filter');
    } else {
      var id = this.context.find('filter', cfg);

      if (!id) {
        id = this.context.addShadow(cfg, this);
      }

      el.setAttribute('filter', "url(#" + id + ")");
    }
  };

  return Painter;
}();

module.exports = Painter;