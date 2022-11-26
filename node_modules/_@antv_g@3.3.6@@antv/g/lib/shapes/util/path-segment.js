var Util = require('../../util/index');

var Inside = require('./inside');

var Cubic = require('../math/cubic');

var Quadratic = require('../math/quadratic');

var Ellipse = require('../math/ellipse');

var vec3 = Util.vec3;
var mat3 = Util.mat3;
var ARR_CMD = ['m', 'l', 'c', 'a', 'q', 'h', 'v', 't', 's', 'z'];

function toAbsolute(x, y, curPoint) {
  // 获取绝对坐标
  return {
    x: curPoint.x + x,
    y: curPoint.y + y
  };
}

function toSymmetry(point, center) {
  // 点对称
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
  var psi = Util.mod(Util.toRadian(psiDeg), Math.PI * 2);
  var x1 = point1.x;
  var y1 = point1.y;
  var x2 = point2.x;
  var y2 = point2.y;
  var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
  var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;
  var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);

  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  var diff = rx * rx * (yp * yp) + ry * ry * (xp * xp);
  var f = Math.sqrt((rx * rx * (ry * ry) - diff) / diff);

  if (fa === fs) {
    f *= -1;
  }

  if (isNaN(f)) {
    f = 0;
  }

  var cxp = f * rx * yp / ry;
  var cyp = f * -ry * xp / rx;
  var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
  var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
  var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
  var u = [(xp - cxp) / rx, (yp - cyp) / ry];
  var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
  var dTheta = vAngle(u, v);

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

  return [point1, cx, cy, rx, ry, theta, dTheta, psi, fs];
}

var PathSegment = function PathSegment(item, preSegment, isLast) {
  this.preSegment = preSegment;
  this.isLast = isLast;
  this.init(item, preSegment);
};

Util.augment(PathSegment, {
  init: function init(item, preSegment) {
    var command = item[0];
    preSegment = preSegment || {
      endPoint: {
        x: 0,
        y: 0
      }
    };
    var relative = ARR_CMD.indexOf(command) >= 0; // /[a-z]/.test(command);

    var cmd = relative ? command.toUpperCase() : command;
    var p = item;
    var point1;
    var point2;
    var point3;
    var point;
    var preEndPoint = preSegment.endPoint;
    var p1 = p[1];
    var p2 = p[2];

    switch (cmd) {
      default:
        break;

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
        this.params = [preEndPoint, point];
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
        this.params = [preEndPoint, point];
        this.subStart = preSegment.subStart;
        this.endPoint = point;

        this.endTangent = function () {
          return [point.x - preEndPoint.x, point.y - preEndPoint.y];
        };

        this.startTangent = function () {
          return [preEndPoint.x - point.x, preEndPoint.y - point.y];
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
        this.params = [preEndPoint, point];
        this.subStart = preSegment.subStart;
        this.endPoint = point;

        this.endTangent = function () {
          return [point.x - preEndPoint.x, point.y - preEndPoint.y];
        };

        this.startTangent = function () {
          return [preEndPoint.x - point.x, preEndPoint.y - point.y];
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
        this.params = [preEndPoint, point];
        this.subStart = preSegment.subStart;
        this.endPoint = point;

        this.endTangent = function () {
          return [point.x - preEndPoint.x, point.y - preEndPoint.y];
        };

        this.startTangent = function () {
          return [preEndPoint.x - point.x, preEndPoint.y - point.y];
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
        this.params = [preEndPoint, point1, point2];
        this.subStart = preSegment.subStart;
        this.endPoint = point2;

        this.endTangent = function () {
          return [point2.x - point1.x, point2.y - point1.y];
        };

        this.startTangent = function () {
          return [preEndPoint.x - point1.x, preEndPoint.y - point1.y];
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
          this.params = [preEndPoint, point1, point2];
          this.subStart = preSegment.subStart;
          this.endPoint = point2;

          this.endTangent = function () {
            return [point2.x - point1.x, point2.y - point1.y];
          };

          this.startTangent = function () {
            return [preEndPoint.x - point1.x, preEndPoint.y - point1.y];
          };
        } else {
          this.command = 'TL';
          this.params = [preEndPoint, point2];
          this.subStart = preSegment.subStart;
          this.endPoint = point2;

          this.endTangent = function () {
            return [point2.x - preEndPoint.x, point2.y - preEndPoint.y];
          };

          this.startTangent = function () {
            return [preEndPoint.x - point2.x, preEndPoint.y - point2.y];
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
        this.params = [preEndPoint, point1, point2, point3];
        this.subStart = preSegment.subStart;
        this.endPoint = point3;

        this.endTangent = function () {
          return [point3.x - point2.x, point3.y - point2.y];
        };

        this.startTangent = function () {
          return [preEndPoint.x - point1.x, preEndPoint.y - point1.y];
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
          this.params = [preEndPoint, point1, point2, point3];
          this.subStart = preSegment.subStart;
          this.endPoint = point3;

          this.endTangent = function () {
            return [point3.x - point2.x, point3.y - point2.y];
          };

          this.startTangent = function () {
            return [preEndPoint.x - point1.x, preEndPoint.y - point1.y];
          };
        } else {
          this.command = 'SQ';
          this.params = [preEndPoint, point2, point3];
          this.subStart = preSegment.subStart;
          this.endPoint = point3;

          this.endTangent = function () {
            return [point3.x - point2.x, point3.y - point2.y];
          };

          this.startTangent = function () {
            return [preEndPoint.x - point2.x, preEndPoint.y - point2.y];
          };
        }

        break;

      case 'A':
        {
          var rx = p1;
          var ry = p2;
          var psi = p[3];
          var fa = p[4];
          var fs = p[5];

          if (relative) {
            point = toAbsolute(p[6], p[7], preEndPoint);
          } else {
            point = {
              x: p[6],
              y: p[7]
            };
          }

          this.command = 'A';
          var params = getArcParams(preEndPoint, point, fa, fs, rx, ry, psi);
          this.params = params;
          var start = preSegment.subStart;
          this.subStart = start;
          this.endPoint = point;
          var startAngle = params[5] % (Math.PI * 2);

          if (Util.isNumberEqual(startAngle, Math.PI * 2)) {
            startAngle = 0;
          }

          var endAngle = params[6] % (Math.PI * 2);

          if (Util.isNumberEqual(endAngle, Math.PI * 2)) {
            endAngle = 0;
          }

          var d = 0.001;

          this.startTangent = function () {
            if (fs === 0) {
              d *= -1;
            }

            var dx = params[3] * Math.cos(startAngle - d) + params[1];
            var dy = params[4] * Math.sin(startAngle - d) + params[2];
            return [dx - start.x, dy - start.y];
          };

          this.endTangent = function () {
            var endAngle = params[6];

            if (endAngle - Math.PI * 2 < 0.0001) {
              endAngle = 0;
            }

            var dx = params[3] * Math.cos(startAngle + endAngle + d) + params[1];
            var dy = params[4] * Math.sin(startAngle + endAngle - d) + params[2];
            return [preEndPoint.x - dx, preEndPoint.y - dy];
          };

          break;
        }

      case 'Z':
        {
          this.command = 'Z';
          this.params = [preEndPoint, preSegment.subStart];
          this.subStart = preSegment.subStart;
          this.endPoint = preSegment.subStart;
        }
    }
  },
  isInside: function isInside(x, y, lineWidth) {
    var self = this;
    var command = self.command;
    var params = self.params;
    var box = self.box;

    if (box) {
      if (!Inside.box(box.minX, box.maxX, box.minY, box.maxY, x, y)) {
        return false;
      }
    }

    switch (command) {
      default:
        break;

      case 'M':
        return false;

      case 'TL':
      case 'L':
      case 'Z':
        return Inside.line(params[0].x, params[0].y, params[1].x, params[1].y, lineWidth, x, y);

      case 'SQ':
      case 'Q':
        return Inside.quadraticline(params[0].x, params[0].y, params[1].x, params[1].y, params[2].x, params[2].y, lineWidth, x, y);

      case 'C':
        {
          return Inside.cubicline(params[0].x, params[0].y, params[1].x, params[1].y, params[2].x, params[2].y, params[3].x, params[3].y, lineWidth, x, y);
        }

      case 'A':
        {
          var p = params;
          var cx = p[1];
          var cy = p[2];
          var rx = p[3];
          var ry = p[4];
          var theta = p[5];
          var dTheta = p[6];
          var psi = p[7];
          var fs = p[8];
          var r = rx > ry ? rx : ry;
          var scaleX = rx > ry ? 1 : rx / ry;
          var scaleY = rx > ry ? ry / rx : 1;
          p = [x, y, 1];
          var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
          mat3.translate(m, m, [-cx, -cy]);
          mat3.rotate(m, m, -psi);
          mat3.scale(m, m, [1 / scaleX, 1 / scaleY]);
          vec3.transformMat3(p, p, m);
          return Inside.arcline(0, 0, r, theta, theta + dTheta, 1 - fs, lineWidth, p[0], p[1]);
        }
    }

    return false;
  },
  draw: function draw(context) {
    var command = this.command;
    var params = this.params;
    var point1;
    var point2;
    var point3;

    switch (command) {
      default:
        break;

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

      case 'A':
        {
          var p = params;
          var p1 = p[1];
          var p2 = p[2];
          var cx = p1;
          var cy = p2;
          var rx = p[3];
          var ry = p[4];
          var theta = p[5];
          var dTheta = p[6];
          var psi = p[7];
          var fs = p[8];
          var r = rx > ry ? rx : ry;
          var scaleX = rx > ry ? 1 : rx / ry;
          var scaleY = rx > ry ? ry / rx : 1;
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
  getBBox: function getBBox(lineWidth) {
    var halfWidth = lineWidth / 2;
    var params = this.params;
    var yDims;
    var xDims;
    var i;
    var l;

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

      case 'A':
        {
          // todo 待优化
          var p = params;
          var cx = p[1];
          var cy = p[2];
          var rx = p[3];
          var ry = p[4];
          var theta = p[5];
          var dTheta = p[6];
          var psi = p[7];
          var fs = p[8];
          var start = theta;
          var end = theta + dTheta;
          var xDim = Ellipse.xExtrema(psi, rx, ry);
          var minX = Infinity;
          var maxX = -Infinity;
          var xs = [start, end];

          for (i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
            var xAngle = xDim + i;

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
            var x = Ellipse.xAt(psi, rx, ry, cx, xs[i]);

            if (x < minX) {
              minX = x;
            }

            if (x > maxX) {
              maxX = x;
            }
          }

          var yDim = Ellipse.yExtrema(psi, rx, ry);
          var minY = Infinity;
          var maxY = -Infinity;
          var ys = [start, end];

          for (i = -Math.PI * 2; i <= Math.PI * 2; i += Math.PI) {
            var yAngle = yDim + i;

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
            var y = Ellipse.yAt(psi, rx, ry, cy, ys[i]);

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