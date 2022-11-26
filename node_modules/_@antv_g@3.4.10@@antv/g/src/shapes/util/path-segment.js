const Util = require('../../util/index');
const Inside = require('./inside');
const Cubic = require('../math/cubic');
const Quadratic = require('../math/quadratic');
const Ellipse = require('../math/ellipse');
const vec3 = Util.vec3;
const mat3 = Util.mat3;

const ARR_CMD = [ 'm', 'l', 'c', 'a', 'q', 'h', 'v', 't', 's', 'z' ];

function toAbsolute(x, y, curPoint) { // 获取绝对坐标
  return {
    x: curPoint.x + x,
    y: curPoint.y + y
  };
}

function toSymmetry(point, center) { // 点对称
  return {
    x: center.x + (center.x - point.x),
    y: center.y + (center.y - point.y)
  };
}

function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function vRatio(u, v) {
  return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
}

function vAngle(u, v) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
}

function getArcParams(point1, point2, fa, fs, rx, ry, psiDeg) {
  const psi = Util.mod(Util.toRadian(psiDeg), Math.PI * 2);
  const x1 = point1.x;
  const y1 = point1.y;
  const x2 = point2.x;
  const y2 = point2.y;
  const xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
  const yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const diff = (rx * rx) * (yp * yp) + (ry * ry) * (xp * xp);
  let f = Math.sqrt((((rx * rx) * (ry * ry)) - diff) / diff);

  if (fa === fs) {
    f *= -1;
  }
  if (isNaN(f)) {
    f = 0;
  }

  const cxp = f * rx * yp / ry;
  const cyp = f * -ry * xp / rx;

  const cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
  const cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

  const theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
  const u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
  const v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
  let dTheta = vAngle(u, v);

  if (vRatio(u, v) <= -1) {
    dTheta = Math.PI;
  }
  if (vRatio(u, v) >= 1) {
    dTheta = 0;
  }
  if (fs === 0 && dTheta > 0) {
    dTheta = dTheta - 2 * Math.PI;
  }
  if (fs === 1 && dTheta < 0) {
    dTheta = dTheta + 2 * Math.PI;
  }
  return [ point1, cx, cy, rx, ry, theta, dTheta, psi, fs ];
}

const PathSegment = function(item, preSegment, isLast) {
  this.preSegment = preSegment;
  this.isLast = isLast;
  this.init(item, preSegment);
};

Util.augment(PathSegment, {
  init(item, preSegment) {
    const command = item[0];
    preSegment = preSegment || {
      endPoint: {
        x: 0,
        y: 0
      }
    };
    const relative = ARR_CMD.indexOf(command) >= 0; // /[a-z]/.test(command);
    const cmd = relative ? command.toUpperCase() : command;
    const p = item;
    let point1;
    let point2;
    let point3;
    let point;
    const preEndPoint = preSegment.endPoint;

    const p1 = p[1];
    const p2 = p[2];
    switch (cmd) {
      default: break;
      case 'M':
        if (relative) {
          point = toAbsolute(p1, p2, preEndPoint);
        } else {
          point = {
            x: p1,
            y: p2
          };
        }
        this.command = 'M';
        this.params = [ preEndPoint, point ];
        this.subStart = point;
        this.endPoint = point;
        break;
      case 'L':
        if (relative) {
          point = toAbsolute(p1, p2, preEndPoint);
        } else {
          point = {
            x: p1,
            y: p2
          };
        }
        this.command = 'L';
        this.params = [ preEndPoint, point ];
        this.subStart = preSegment.subStart;
        this.endPoint = point;
        this.endTangent = function() {
          return [ point.x - preEndPoint.x, point.y - preEndPoint.y ];
        };
        this.startTangent = function() {
          return [ preEndPoint.x - point.x, preEndPoint.y - point.y ];
        };
        break;
      case 'H':
        if (relative) {
          point = toAbsolute(p1, 0, preEndPoint);
        } else {
          point = {
            x: p1,
            y: preEndPoint.y
          };
        }
        this.command = 'L';
        this.params = [ preEndPoint, point ];
        this.subStart = preSegment.subStart;
        this.endPoint = point;
        this.endTangent = function() {
          return [ point.x - preEndPoint.x, point.y - preEndPoint.y ];
        };
        this.startTangent = function() {
          return [ preEndPoint.x - point.x, preEndPoint.y - point.y ];
        };
        break;
      case 'V':
        if (relative) {
          point = toAbsolute(0, p1, preEndPoint);
        } else {
          point = {
            x: preEndPoint.x,
            y: p1
          };
        }
        this.command = 'L';
        this.params = [ preEndPoint, point ];
        this.subStart = preSegment.subStart;
        this.endPoint = point;
        this.endTangent = function() {
          return [ point.x - preEndPoint.x, point.y - preEndPoint.y ];
        };
        this.startTangent = function() {
          return [ preEndPoint.x - point.x, preEndPoint.y - point.y ];
        };
        break;
      case 'Q':
        if (relative) {
          point1 = toAbsolute(p1, p2, preEndPoint);
          point2 = toAbsolute(p[3], p[4], preEndPoint);
        } else {
          point1 = {
            x: p1,
            y: p2
          };
          point2 = {
            x: p[3],
            y: p[4]
          };
        }
        this.command = 'Q';
        this.params = [ preEndPoint, point1, point2 ];
        this.subStart = preSegment.subStart;
        this.endPoint = point2;
        this.endTangent = function() {
          return [ point2.x - point1.x, point2.y - point1.y ];
        };
        this.startTangent = function() {
          return [ preEndPoint.x - point1.x, preEndPoint.y - point1.y ];
        };
        break;
      case 'T':
        if (relative) {
          point2 = toAbsolute(p1, p2, preEndPoint);
        } else {
          point2 = {
            x: p1,
            y: p2
          };
        }
        if (preSegment.command === 'Q') {
          point1 = toSymmetry(preSegment.params[1], preEndPoint);
          this.command = 'Q';
          this.params = [ preEndPoint, point1, point2 ];
          this.subStart = preSegment.subStart;
          this.endPoint = point2;
          this.endTangent = function() {
            return [ point2.x - point1.x, point2.y - point1.y ];
          };
          this.startTangent = function() {
            return [ preEndPoint.x - point1.x, preEndPoint.y - point1.y ];
          };
        } else {
          this.command = 'TL';
          this.params = [ preEndPoint, point2 ];
          this.subStart = preSegment.subStart;
          this.endPoint = point2;
          this.endTangent = function() {
            return [ point2.x - preEndPoint.x, point2.y - preEndPoint.y ];
          };
          this.startTangent = function() {
            return [ preEndPoint.x - point2.x, preEndPoint.y - point2.y ];
          };
        }

        break;
      case 'C':
        if (relative) {
          point1 = toAbsolute(p1, p2, preEndPoint);
          point2 = toAbsolute(p[3], p[4], preEndPoint);
          point3 = toAbsolute(p[5], p[6], preEndPoint);
        } else {
          point1 = {
            x: p1,
            y: p2
          };
          point2 = {
            x: p[3],
            y: p[4]
          };
          point3 = {
            x: p[5],
            y: p[6]
          };
        }
        this.command = 'C';
        this.params = [ preEndPoint, point1, point2, point3 ];
        this.subStart = preSegment.subStart;
        this.endPoint = point3;
        this.endTangent = function() {
          return [ point3.x - point2.x, point3.y - point2.y ];
        };
        this.startTangent = function() {
          return [ preEndPoint.x - point1.x, preEndPoint.y - point1.y ];
        };
        break;
      case 'S':
        if (relative) {
          point2 = toAbsolute(p1, p2, preEndPoint);
          point3 = toAbsolute(p[3], p[4], preEndPoint);
        } else {
          point2 = {
            x: p1,
            y: p2
          };
          point3 = {
            x: p[3],
            y: p[4]
          };
        }
        if (preSegment.command === 'C') {
          point1 = toSymmetry(preSegment.params[2], preEndPoint);
          this.command = 'C';
          this.params = [ preEndPoint, point1, point2, point3 ];
          this.subStart = preSegment.subStart;
          this.endPoint = point3;
          this.endTangent = function() {
            return [ point3.x - point2.x, point3.y - point2.y ];
          };
          this.startTangent = function() {
            return [ preEndPoint.x - point1.x, preEndPoint.y - point1.y ];
          };
        } else {
          this.command = 'SQ';
          this.params = [ preEndPoint, point2, point3 ];
          this.subStart = preSegment.subStart;
          this.endPoint = point3;
          this.endTangent = function() {
            return [ point3.x - point2.x, point3.y - point2.y ];
          };
          this.startTangent = function() {
            return [ preEndPoint.x - point2.x, preEndPoint.y - point2.y ];
          };
        }
        break;
      case 'A': {
        const rx = p1;
        const ry = p2;
        const psi = p[3];
        const fa = p[4];
        const fs = p[5];
        if (relative) {
          point = toAbsolute(p[6], p[7], preEndPoint);
        } else {
          point = {
            x: p[6],
            y: p[7]
          };
        }

        this.command = 'A';
        const params = getArcParams(preEndPoint, point, fa, fs, rx, ry, psi);
        this.params = params;
        const start = preSegment.subStart;
        this.subStart = start;
        this.endPoint = point;
        let startAngle = params[5] % (Math.PI * 2);
        if (Util.isNumberEqual(startAngle, Math.PI * 2)) {
          startAngle = 0;
        }
        let endAngle = params[6] % (Math.PI * 2);
        if (Util.isNumberEqual(endAngle, Math.PI * 2)) {
          endAngle = 0;
        }
        let d = 0.001;
        this.startTangent = function() {
          if (fs === 0) {
            d *= -1;
          }
          const dx = params[3] * Math.cos(startAngle - d) + params[1];
          const dy = params[4] * Math.sin(startAngle - d) + params[2];
          return [ dx - start.x, dy - start.y ];
        };
        this.endTangent = function() {
          let endAngle = params[6];
          if (endAngle - Math.PI * 2 < 0.0001) {
            endAngle = 0;
          }
          const dx = params[3] * Math.cos(startAngle + endAngle + d) + params[1];
          const dy = params[4] * Math.sin(startAngle + endAngle - d) + params[2];
          return [ preEndPoint.x - dx, preEndPoint.y - dy ];
        };
        break;
      }
      case 'Z': {
        this.command = 'Z';
        this.params = [ preEndPoint, preSegment.subStart ];
        this.subStart = preSegment.subStart;
        this.endPoint = preSegment.subStart;
      }
    }
  },
  isInside(x, y, lineWidth) {
    const self = this;
    const command = self.command;
    const params = self.params;
    const box = self.box;
    if (box) {
      if (!Inside.box(box.minX, box.maxX, box.minY, box.maxY, x, y)) {
        return false;
      }
    }
    switch (command) {
      default: break;
      case 'M':
        return false;
      case 'TL':
      case 'L':
      case 'Z':
        return Inside.line(
          params[0].x, params[0].y,
          params[1].x, params[1].y,
          lineWidth, x, y
        );
      case 'SQ':
      case 'Q':
        return Inside.quadraticline(
          params[0].x, params[0].y,
          params[1].x, params[1].y,
          params[2].x, params[2].y,
          lineWidth, x, y
        );
      case 'C': {
        return Inside.cubicline(
          params[0].x, params[0].y,
          params[1].x, params[1].y,
          params[2].x, params[2].y,
          params[3].x, params[3].y,
          lineWidth, x, y
        );
      }
      case 'A': {
        let p = params;
        const cx = p[1];
        const cy = p[2];
        const rx = p[3];
        const ry = p[4];
        const theta = p[5];
        const dTheta = p[6];
        const psi = p[7];
        const fs = p[8];

        const r = (rx > ry) ? rx : ry;
        const scaleX = (rx > ry) ? 1 : rx / ry;
        const scaleY = (rx > ry) ? ry / rx : 1;

        p = [ x, y, 1 ];
        const m = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
        mat3.translate(m, m, [ -cx, -cy ]);
        mat3.rotate(m, m, -psi);
        mat3.scale(m, m, [ 1 / scaleX, 1 / scaleY ]);
        vec3.transformMat3(p, p, m);
        return Inside.arcline(0, 0, r, theta, theta + dTheta, 1 - fs, lineWidth, p[0], p[1]);
      }
    }
    return false;
  },
  draw(context) {
    const command = this.command;
    const params = this.params;
    let point1;
    let point2;
    let point3;

    switch (command) {
      default: break;
      case 'M':
        context.moveTo(params[1].x, params[1].y);
        break;
      case 'TL':
      case 'L':
        context.lineTo(params[1].x, params[1].y);
        break;
      case 'SQ':
      case 'Q':
        point1 = params[1];
        point2 = params[2];
        context.quadraticCurveTo(point1.x, point1.y, point2.x, point2.y);
        break;
      case 'C':
        point1 = params[1];
        point2 = params[2];
        point3 = params[3];
        context.bezierCurveTo(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y);
        break;
      case 'A': {
        const p = params;
        const p1 = p[1];
        const p2 = p[2];
        const cx = p1;
        const cy = p2;
        const rx = p[3];
        const ry = p[4];
        const theta = p[5];
        const dTheta = p[6];
        const psi = p[7];
        const fs = p[8];

        const r = (rx > ry) ? rx : ry;
        const scaleX = (rx > ry) ? 1 : rx / ry;
        const scaleY = (rx > ry) ? ry / rx : 1;

        context.translate(cx, cy);
        context.rotate(psi);
        context.scale(scaleX, scaleY);
        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
        context.scale(1 / scaleX, 1 / scaleY);
        context.rotate(-psi);
        context.translate(-cx, -cy);
        break;
      }
      case 'Z':
        context.closePath();
        break;
    }
  },
  shortenDraw(context, dx, dy) {
    const command = this.command;
    const params = this.params;
    let point1;
    let point2;
    let point3;

    switch (command) {
      default: break;
      case 'M':
        context.moveTo(params[1].x - dx, params[1].y - dy);
        break;
      case 'TL':
      case 'L':
        context.lineTo(params[1].x - dx, params[1].y - dy);
        break;
      case 'SQ':
      case 'Q':
        point1 = params[1];
        point2 = params[2];
        context.quadraticCurveTo(point1.x, point1.y, point2.x - dx, point2.y - dy);
        break;
      case 'C':
        point1 = params[1];
        point2 = params[2];
        point3 = params[3];
        context.bezierCurveTo(point1.x, point1.y, point2.x, point2.y, point3.x - dx, point3.y - dy);
        break;
      case 'A': {
        const p = params;
        const p1 = p[1];
        const p2 = p[2];
        const cx = p1;
        const cy = p2;
        const rx = p[3];
        const ry = p[4];
        const theta = p[5];
        const dTheta = p[6];
        const psi = p[7];
        const fs = p[8];

        const r = (rx > ry) ? rx : ry;
        const scaleX = (rx > ry) ? 1 : rx / ry;
        const scaleY = (rx > ry) ? ry / rx : 1;

        context.translate(cx, cy);
        context.rotate(psi);
        context.scale(scaleX, scaleY);
        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
        context.scale(1 / scaleX, 1 / scaleY);
        context.rotate(-psi);
        context.translate(-cx, -cy);
        break;
      }
      case 'Z':
        context.closePath();
        break;
    }
  },
  getBBox(lineWidth) {
    const halfWidth = lineWidth / 2;
    const params = this.params;
    let yDims;
    let xDims;
    let i;
    let l;

    switch (this.command) {
      default:
      case 'M':
      case 'Z':
        break;
      case 'TL':
      case 'L':
        this.box = {
          minX: Math.min(params[0].x, params[1].x) - halfWidth,
          maxX: Math.max(params[0].x, params[1].x) + halfWidth,
          minY: Math.min(params[0].y, params[1].y) - halfWidth,
          maxY: Math.max(params[0].y, params[1].y) + halfWidth
        };
        break;
      case 'SQ':
      case 'Q':
        xDims = Quadratic.extrema(params[0].x, params[1].x, params[2].x);
        for (i = 0, l = xDims.length; i < l; i++) {
          xDims[i] = Quadratic.at(params[0].x, params[1].x, params[2].x, xDims[i]);
        }
        xDims.push(params[0].x, params[2].x);
        yDims = Quadratic.extrema(params[0].y, params[1].y, params[2].y);
        for (i = 0, l = yDims.length; i < l; i++) {
          yDims[i] = Quadratic.at(params[0].y, params[1].y, params[2].y, yDims);
        }
        yDims.push(params[0].y, params[2].y);
        this.box = {
          minX: Math.min.apply(Math, xDims) - halfWidth,
          maxX: Math.max.apply(Math, xDims) + halfWidth,
          minY: Math.min.apply(Math, yDims) - halfWidth,
          maxY: Math.max.apply(Math, yDims) + halfWidth
        };
        break;
      case 'C':
        xDims = Cubic.extrema(params[0].x, params[1].x, params[2].x, params[3].x);
        for (i = 0, l = xDims.length; i < l; i++) {
          xDims[i] = Cubic.at(params[0].x, params[1].x, params[2].x, params[3].x, xDims[i]);
        }
        yDims = Cubic.extrema(params[0].y, params[1].y, params[2].y, params[3].y);
        for (i = 0, l = yDims.length; i < l; i++) {
          yDims[i] = Cubic.at(params[0].y, params[1].y, params[2].y, params[3].y, yDims[i]);
        }
        xDims.push(params[0].x, params[3].x);
        yDims.push(params[0].y, params[3].y);
        this.box = {
          minX: Math.min.apply(Math, xDims) - halfWidth,
          maxX: Math.max.apply(Math, xDims) + halfWidth,
          minY: Math.min.apply(Math, yDims) - halfWidth,
          maxY: Math.max.apply(Math, yDims) + halfWidth
        };
        break;
      case 'A': {
        // todo 待优化
        const p = params;
        const cx = p[1];
        const cy = p[2];
        const rx = p[3];
        const ry = p[4];
        const theta = p[5];
        const dTheta = p[6];
        const psi = p[7];
        const fs = p[8];
        const start = theta;
        const end = theta + dTheta;

        const xDim = Ellipse.xExtrema(psi, rx, ry);
        let minX = Infinity;
        let maxX = -Infinity;
        const xs = [ start, end ];
        for (i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
          const xAngle = xDim + i;
          if (fs === 1) {
            if (start < xAngle && xAngle < end) {
              xs.push(xAngle);
            }
          } else {
            if (end < xAngle && xAngle < start) {
              xs.push(xAngle);
            }
          }
        }

        for (i = 0, l = xs.length; i < l; i++) {
          const x = Ellipse.xAt(psi, rx, ry, cx, xs[i]);
          if (x < minX) {
            minX = x;
          }
          if (x > maxX) {
            maxX = x;
          }
        }

        const yDim = Ellipse.yExtrema(psi, rx, ry);
        let minY = Infinity;
        let maxY = -Infinity;
        const ys = [ start, end ];
        for (i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
          const yAngle = yDim + i;
          if (fs === 1) {
            if (start < yAngle && yAngle < end) {
              ys.push(yAngle);
            }
          } else {
            if (end < yAngle && yAngle < start) {
              ys.push(yAngle);
            }
          }
        }

        for (i = 0, l = ys.length; i < l; i++) {
          const y = Ellipse.yAt(psi, rx, ry, cy, ys[i]);
          if (y < minY) {
            minY = y;
          }
          if (y > maxY) {
            maxY = y;
          }
        }
        this.box = {
          minX: minX - halfWidth,
          maxX: maxX + halfWidth,
          minY: minY - halfWidth,
          maxY: maxY + halfWidth
        };
        break;
      }
    }
  }
});

module.exports = PathSegment;
