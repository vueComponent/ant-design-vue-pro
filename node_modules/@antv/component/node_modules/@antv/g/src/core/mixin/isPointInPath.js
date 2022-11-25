const Util = require('../../util/index');
const Inside = require('../../shapes/util/inside');

const mathUtl = {
  arc: require('../../shapes/math/arc'),
  ellipse: require('../../shapes/math/ellipse'),
  line: require('../../shapes/math/line')
};

const canvas = Util.createDom('<canvas width="500" height="500"></canvas>');
const context = canvas.getContext('2d');

function isPointInPathByContext(x, y, ctx) {
  ctx.createPath(context);
  return context.isPointInPath(x, y);
}

const arc = function arc(x, y) {
  const attrs = this._attrs;
  const cx = attrs.x;
  const cy = attrs.y;
  const { r, startAngle, endAngle, clockwise } = attrs;
  const lineWidth = this.getHitLineWidth();
  if (this.hasStroke()) {
    return Inside.arcline(cx, cy, r, startAngle, endAngle, clockwise, lineWidth, x, y);
  }
  return false;
};

const circle = function circle(x, y) {
  const attrs = this._attrs;
  const cx = attrs.x;
  const cy = attrs.y;
  const r = attrs.r;
  const lineWidth = this.getHitLineWidth();
  const fill = this.hasFill();
  const stroke = this.hasStroke();

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

const ellipse = function ellipse(x, y) {
  const attrs = this._attrs;
  const fill = this.hasFill();
  const stroke = this.hasStroke();
  const cx = attrs.x;
  const cy = attrs.y;
  const rx = attrs.rx;
  const ry = attrs.ry;
  const lineWidth = this.getHitLineWidth();
  const r = (rx > ry) ? rx : ry;
  const scaleX = (rx > ry) ? 1 : rx / ry;
  const scaleY = (rx > ry) ? ry / rx : 1;
  const p = [ x, y, 1 ];
  const m = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
  Util.mat3.scale(m, m, [ scaleX, scaleY ]);
  Util.mat3.translate(m, m, [ cx, cy ]);
  const inm = Util.mat3.invert([], m);
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

const fan = function fan(x, y) {
  const self = this;
  const fill = self.hasFill();
  const stroke = self.hasStroke();
  const attrs = self._attrs;
  const cx = attrs.x;
  const cy = attrs.y;
  const rs = attrs.rs;
  const re = attrs.re;
  const startAngle = attrs.startAngle;
  const endAngle = attrs.endAngle;
  const clockwise = attrs.clockwise;
  const v1 = [ 1, 0 ];
  const subv = [ x - cx, y - cy ];
  const angle = Util.vec2.angleTo(v1, subv);

  function _isPointInFill() {
    const angle1 = mathUtl.arc.nearAngle(angle, startAngle, endAngle, clockwise);

    if (Util.isNumberEqual(angle, angle1)) {
      const ls = Util.vec2.squaredLength(subv);
      if (rs * rs <= ls && ls <= re * re) {
        return true;
      }
    }
    return false;
  }

  function _isPointInStroke() {
    const lineWidth = self.getHitLineWidth();

    const ssp = {
      x: Math.cos(startAngle) * rs + cx,
      y: Math.sin(startAngle) * rs + cy
    };
    const sep = {
      x: Math.cos(startAngle) * re + cx,
      y: Math.sin(startAngle) * re + cy
    };
    const esp = {
      x: Math.cos(endAngle) * rs + cx,
      y: Math.sin(endAngle) * rs + cy
    };
    const eep = {
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

const image = function image(x, y) {
  const attrs = this._attrs;
  if (this.get('toDraw') || !attrs.img) {
    return false;
  }
  if (!this._cfg.attrs || this._cfg.attrs.img !== attrs.img) {
    this._setAttrImg();
  }
  const rx = attrs.x;
  const ry = attrs.y;
  const width = attrs.width;
  const height = attrs.height;
  return Inside.rect(rx, ry, width, height, x, y);
};

const line = function line(x, y) {
  const attrs = this._attrs;
  const { x1, y1, x2, y2 } = attrs;
  const lineWidth = this.getHitLineWidth();

  if (this.hasStroke()) {
    return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
  }

  return false;
};

const path = function path(x, y) {
  const self = this;
  const segments = self.get('segments');
  const fill = self.hasFill();
  const stroke = self.hasStroke();
  function _isPointInStroke() {
    if (!Util.isEmpty(segments)) {
      const lineWidth = self.getHitLineWidth();
      for (let i = 0, l = segments.length; i < l; i++) {
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

const polygon = function polygon(x, y) {
  const self = this;
  const fill = self.hasFill();
  const stroke = self.hasStroke();

  function _isPointInStroke() {
    const attrs = self._attrs;
    const points = attrs.points;
    if (points.length < 2) {
      return false;
    }
    const lineWidth = self.getHitLineWidth();
    const outPoints = points.slice(0);
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

const marker = function marker(x, y) {
  const attrs = this._attrs;
  const cx = attrs.x;
  const cy = attrs.y;
  const r = attrs.radius || attrs.r;
  const lineWidth = this.getHitLineWidth();
  return Inside.circle(cx, cy, r + lineWidth / 2, x, y);
};


const polyline = function polyline(x, y) {
  const self = this;
  const attrs = self._attrs;
  if (self.hasStroke()) {
    const points = attrs.points;
    if (points.length < 2) {
      return false;
    }
    const lineWidth = attrs.lineWidth;
    return Inside.polyline(points, lineWidth, x, y);
  }
  return false;
};

const rect = function rect(x, y) {
  const self = this;
  const fill = self.hasFill();
  const stroke = self.hasStroke();

  function _isPointInStroke() {
    const attrs = self._attrs;
    const rx = attrs.x;
    const ry = attrs.y;
    const width = attrs.width;
    const height = attrs.height;
    const radius = attrs.radius;
    const lineWidth = self.getHitLineWidth();

    if (radius === 0) {
      const halfWidth = lineWidth / 2;
      return Inside.line(rx - halfWidth, ry, rx + width + halfWidth, ry, lineWidth, x, y) ||
        Inside.line(rx + width, ry - halfWidth, rx + width, ry + height + halfWidth, lineWidth, x, y) ||
        Inside.line(rx + width + halfWidth, ry + height, rx - halfWidth, ry + height, lineWidth, x, y) ||
        Inside.line(rx, ry + height + halfWidth, rx, ry - halfWidth, lineWidth, x, y);
    }

    return Inside.line(rx + radius, ry, rx + width - radius, ry, lineWidth, x, y) ||
      Inside.line(rx + width, ry + radius, rx + width, ry + height - radius, lineWidth, x, y) ||
      Inside.line(rx + width - radius, ry + height, rx + radius, ry + height, lineWidth, x, y) ||
      Inside.line(rx, ry + height - radius, rx, ry + radius, lineWidth, x, y) ||
      Inside.arcline(rx + width - radius, ry + radius, radius, 1.5 * Math.PI, 2 * Math.PI, false, lineWidth, x, y) ||
      Inside.arcline(rx + width - radius, ry + height - radius, radius, 0, 0.5 * Math.PI, false, lineWidth, x, y) ||
      Inside.arcline(rx + radius, ry + height - radius, radius, 0.5 * Math.PI, Math.PI, false, lineWidth, x, y) ||
      Inside.arcline(rx + radius, ry + radius, radius, Math.PI, 1.5 * Math.PI, false, lineWidth, x, y);
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

const text = function text(x, y) {
  const self = this;
  const box = self.getBBox();
  if (self.hasFill() || self.hasStroke()) {
    return Inside.box(box.minX, box.maxX, box.minY, box.maxY, x, y);
  }
};

const dom = function dom(x, y) {
  if (!this._cfg.el) {
    return false;
  }
  const box = this._cfg.el.getBBox();
  return Inside.box(box.x, box.x + box.width, box.y, box.y + box.height, x, y);
};

const shapes = {
  arc,
  circle,
  dom,
  ellipse,
  fan,
  image,
  line,
  path,
  marker,
  polygon,
  polyline,
  rect,
  text
};

module.exports = {
  isPointInPath(x, y) {
    const shape = shapes[this.type];
    if (shape) {
      return shape.call(this, x, y);
    }
    return false;
  }
};
