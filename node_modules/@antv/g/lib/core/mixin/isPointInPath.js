var Util = require('../../util/index');

var Inside = require('../../shapes/util/inside');

var mathUtl = {
  arc: require('../../shapes/math/arc'),
  ellipse: require('../../shapes/math/ellipse'),
  line: require('../../shapes/math/line')
};
var canvas = Util.createDom('<canvas width="1" height="1"></canvas>');
var context = canvas.getContext('2d');

function isPointInPathByContext(x, y, ctx) {
  ctx.createPath(context);
  return context.isPointInPath(x, y);
}

var arc = function arc(x, y) {
  var attrs = this._attrs;
  var cx = attrs.x;
  var cy = attrs.y;
  var r = attrs.r,
      startAngle = attrs.startAngle,
      endAngle = attrs.endAngle,
      clockwise = attrs.clockwise;
  var lineWidth = this.getHitLineWidth();

  if (this.hasStroke()) {
    return Inside.arcline(cx, cy, r, startAngle, endAngle, clockwise, lineWidth, x, y);
  }

  return false;
};

var circle = function circle(x, y) {
  var attrs = this._attrs;
  var cx = attrs.x;
  var cy = attrs.y;
  var r = attrs.r;
  var lineWidth = this.getHitLineWidth();
  var fill = this.hasFill();
  var stroke = this.hasStroke();

  if (fill && stroke) {
    return Inside.circle(cx, cy, r, x, y) || Inside.arcline(cx, cy, r, 0, Math.PI * 2, false, lineWidth, x, y);
  }

  if (fill) {
    return Inside.circle(cx, cy, r, x, y);
  }

  if (stroke) {
    return Inside.arcline(cx, cy, r, 0, Math.PI * 2, false, lineWidth, x, y);
  }

  return false;
};

var ellipse = function ellipse(x, y) {
  var attrs = this._attrs;
  var fill = this.hasFill();
  var stroke = this.hasStroke();
  var cx = attrs.x;
  var cy = attrs.y;
  var rx = attrs.rx;
  var ry = attrs.ry;
  var lineWidth = this.getHitLineWidth();
  var r = rx > ry ? rx : ry;
  var scaleX = rx > ry ? 1 : rx / ry;
  var scaleY = rx > ry ? ry / rx : 1;
  var p = [x, y, 1];
  var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  Util.mat3.scale(m, m, [scaleX, scaleY]);
  Util.mat3.translate(m, m, [cx, cy]);
  var inm = Util.mat3.invert([], m);
  Util.vec3.transformMat3(p, p, inm);

  if (fill && stroke) {
    return Inside.circle(0, 0, r, p[0], p[1]) || Inside.arcline(0, 0, r, 0, Math.PI * 2, false, lineWidth, p[0], p[1]);
  }

  if (fill) {
    return Inside.circle(0, 0, r, p[0], p[1]);
  }

  if (stroke) {
    return Inside.arcline(0, 0, r, 0, Math.PI * 2, false, lineWidth, p[0], p[1]);
  }

  return false;
};

var fan = function fan(x, y) {
  var self = this;
  var fill = self.hasFill();
  var stroke = self.hasStroke();
  var attrs = self._attrs;
  var cx = attrs.x;
  var cy = attrs.y;
  var rs = attrs.rs;
  var re = attrs.re;
  var startAngle = attrs.startAngle;
  var endAngle = attrs.endAngle;
  var clockwise = attrs.clockwise;
  var v1 = [1, 0];
  var subv = [x - cx, y - cy];
  var angle = Util.vec2.angleTo(v1, subv);

  function _isPointInFill() {
    var angle1 = mathUtl.arc.nearAngle(angle, startAngle, endAngle, clockwise);

    if (Util.isNumberEqual(angle, angle1)) {
      var ls = Util.vec2.squaredLength(subv);

      if (rs * rs <= ls && ls <= re * re) {
        return true;
      }
    }

    return false;
  }

  function _isPointInStroke() {
    var lineWidth = self.getHitLineWidth();
    var ssp = {
      x: Math.cos(startAngle) * rs + cx,
      y: Math.sin(startAngle) * rs + cy
    };
    var sep = {
      x: Math.cos(startAngle) * re + cx,
      y: Math.sin(startAngle) * re + cy
    };
    var esp = {
      x: Math.cos(endAngle) * rs + cx,
      y: Math.sin(endAngle) * rs + cy
    };
    var eep = {
      x: Math.cos(endAngle) * re + cx,
      y: Math.sin(endAngle) * re + cy
    };

    if (Inside.line(ssp.x, ssp.y, sep.x, sep.y, lineWidth, x, y)) {
      return true;
    }

    if (Inside.line(esp.x, esp.y, eep.x, eep.y, lineWidth, x, y)) {
      return true;
    }

    if (Inside.arcline(cx, cy, rs, startAngle, endAngle, clockwise, lineWidth, x, y)) {
      return true;
    }

    if (Inside.arcline(cx, cy, re, startAngle, endAngle, clockwise, lineWidth, x, y)) {
      return true;
    }

    return false;
  }

  if (fill && stroke) {
    return _isPointInFill() || _isPointInStroke();
  }

  if (fill) {
    return _isPointInFill();
  }

  if (stroke) {
    return _isPointInStroke();
  }

  return false;
};

var image = function image(x, y) {
  var attrs = this._attrs;

  if (this.get('toDraw') || !attrs.img) {
    return false;
  }

  if (!this._cfg.attrs || this._cfg.attrs.img !== attrs.img) {
    this._setAttrImg();
  }

  var rx = attrs.x;
  var ry = attrs.y;
  var width = attrs.width;
  var height = attrs.height;
  return Inside.rect(rx, ry, width, height, x, y);
};

var line = function line(x, y) {
  var attrs = this._attrs;
  var x1 = attrs.x1,
      y1 = attrs.y1,
      x2 = attrs.x2,
      y2 = attrs.y2;
  var lineWidth = this.getHitLineWidth();

  if (this.hasStroke()) {
    return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
  }

  return false;
};

var path = function path(x, y) {
  var self = this;
  var segments = self.get('segments');
  var fill = self.hasFill();
  var stroke = self.hasStroke();

  function _isPointInStroke() {
    if (!Util.isEmpty(segments)) {
      var lineWidth = self.getHitLineWidth();

      for (var i = 0, l = segments.length; i < l; i++) {
        if (segments[i].isInside(x, y, lineWidth)) {
          return true;
        }
      }

      return false;
    }
  }

  if (fill && stroke) {
    return isPointInPathByContext(x, y, self) || _isPointInStroke();
  }

  if (fill) {
    return isPointInPathByContext(x, y, self);
  }

  if (stroke) {
    return _isPointInStroke();
  }

  return false;
};

var polygon = function polygon(x, y) {
  var self = this;
  var fill = self.hasFill();
  var stroke = self.hasStroke();

  function _isPointInStroke() {
    var attrs = self._attrs;
    var points = attrs.points;

    if (points.length < 2) {
      return false;
    }

    var lineWidth = self.getHitLineWidth();
    var outPoints = points.slice(0);

    if (points.length >= 3) {
      outPoints.push(points[0]);
    }

    return Inside.polyline(outPoints, lineWidth, x, y);
  }

  if (fill && stroke) {
    return isPointInPathByContext(x, y, self) || _isPointInStroke();
  }

  if (fill) {
    return isPointInPathByContext(x, y, self);
  }

  if (stroke) {
    return _isPointInStroke();
  }

  return false;
};

var marker = function marker(x, y) {
  var attrs = this._attrs;
  var cx = attrs.x;
  var cy = attrs.y;
  var r = attrs.radius || attrs.r;
  var lineWidth = this.getHitLineWidth();
  return Inside.circle(cx, cy, r + lineWidth / 2, x, y);
};

var polyline = function polyline(x, y) {
  var self = this;
  var attrs = self._attrs;

  if (self.hasStroke()) {
    var points = attrs.points;

    if (points.length < 2) {
      return false;
    }

    var lineWidth = attrs.lineWidth;
    return Inside.polyline(points, lineWidth, x, y);
  }

  return false;
};

var rect = function rect(x, y) {
  var self = this;
  var fill = self.hasFill();
  var stroke = self.hasStroke();

  function _isPointInStroke() {
    var attrs = self._attrs;
    var rx = attrs.x;
    var ry = attrs.y;
    var width = attrs.width;
    var height = attrs.height;
    var radius = attrs.radius;
    var lineWidth = self.getHitLineWidth();

    if (radius === 0) {
      var halfWidth = lineWidth / 2;
      return Inside.line(rx - halfWidth, ry, rx + width + halfWidth, ry, lineWidth, x, y) || Inside.line(rx + width, ry - halfWidth, rx + width, ry + height + halfWidth, lineWidth, x, y) || Inside.line(rx + width + halfWidth, ry + height, rx - halfWidth, ry + height, lineWidth, x, y) || Inside.line(rx, ry + height + halfWidth, rx, ry - halfWidth, lineWidth, x, y);
    }

    return Inside.line(rx + radius, ry, rx + width - radius, ry, lineWidth, x, y) || Inside.line(rx + width, ry + radius, rx + width, ry + height - radius, lineWidth, x, y) || Inside.line(rx + width - radius, ry + height, rx + radius, ry + height, lineWidth, x, y) || Inside.line(rx, ry + height - radius, rx, ry + radius, lineWidth, x, y) || Inside.arcline(rx + width - radius, ry + radius, radius, 1.5 * Math.PI, 2 * Math.PI, false, lineWidth, x, y) || Inside.arcline(rx + width - radius, ry + height - radius, radius, 0, 0.5 * Math.PI, false, lineWidth, x, y) || Inside.arcline(rx + radius, ry + height - radius, radius, 0.5 * Math.PI, Math.PI, false, lineWidth, x, y) || Inside.arcline(rx + radius, ry + radius, radius, Math.PI, 1.5 * Math.PI, false, lineWidth, x, y);
  }

  if (fill && stroke) {
    return isPointInPathByContext(x, y, self) || _isPointInStroke();
  }

  if (fill) {
    return isPointInPathByContext(x, y, self);
  }

  if (stroke) {
    return _isPointInStroke();
  }

  return false;
};

var text = function text(x, y) {
  var self = this;
  var box = self.getBBox();

  if (self.hasFill() || self.hasStroke()) {
    return Inside.box(box.minX, box.maxX, box.minY, box.maxY, x, y);
  }
};

var dom = function dom(x, y) {
  if (!this._cfg.el) {
    return false;
  }

  var box = this._cfg.el.getBBox();

  return Inside.box(box.x, box.x + box.width, box.y, box.y + box.height, x, y);
};

var shapes = {
  arc: arc,
  circle: circle,
  dom: dom,
  ellipse: ellipse,
  fan: fan,
  image: image,
  line: line,
  path: path,
  marker: marker,
  polygon: polygon,
  polyline: polyline,
  rect: rect,
  text: text
};
module.exports = {
  isPointInPath: function isPointInPath(x, y) {
    var shape = shapes[this.type];

    if (shape) {
      return shape.call(this, x, y);
    }

    return false;
  }
};