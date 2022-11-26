var isArray = require('../type/is-array');
var rectPath = require('./rect-path');
var pathTocurve = require('./path2curve');

var base3 = function base3(t, p1, p2, p3, p4) {
  var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
  var t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
};

var bezlen = function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
  if (z === null) {
    z = 1;
  }
  z = z > 1 ? 1 : z < 0 ? 0 : z;
  var z2 = z / 2;
  var n = 12;
  var Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816];
  var Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472];
  var sum = 0;
  for (var i = 0; i < n; i++) {
    var ct = z2 * Tvalues[i] + z2;
    var xbase = base3(ct, x1, x2, x3, x4);
    var ybase = base3(ct, y1, y2, y3, y4);
    var comb = xbase * xbase + ybase * ybase;
    sum += Cvalues[i] * Math.sqrt(comb);
  }
  return z2 * sum;
};

var curveDim = function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
  var tvalues = [];
  var bounds = [[], []];
  var a = void 0;
  var b = void 0;
  var c = void 0;
  var t = void 0;

  for (var i = 0; i < 2; ++i) {
    if (i === 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (t > 0 && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    var b2ac = b * b - 4 * c * a;
    var sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    var t1 = (-b + sqrtb2ac) / (2 * a);
    if (t1 > 0 && t1 < 1) {
      tvalues.push(t1);
    }
    var t2 = (-b - sqrtb2ac) / (2 * a);
    if (t2 > 0 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  var j = tvalues.length;
  var jlen = j;
  var mt = void 0;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  bounds[0].length = bounds[1].length = jlen + 2;

  return {
    min: {
      x: Math.min.apply(0, bounds[0]),
      y: Math.min.apply(0, bounds[1])
    },
    max: {
      x: Math.max.apply(0, bounds[0]),
      y: Math.max.apply(0, bounds[1])
    }
  };
};

var intersect = function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  if (Math.max(x1, x2) < Math.min(x3, x4) || Math.min(x1, x2) > Math.max(x3, x4) || Math.max(y1, y2) < Math.min(y3, y4) || Math.min(y1, y2) > Math.max(y3, y4)) {
    return;
  }
  var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  var ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (!denominator) {
    return;
  }
  var px = nx / denominator;
  var py = ny / denominator;
  var px2 = +px.toFixed(2);
  var py2 = +py.toFixed(2);
  if (px2 < +Math.min(x1, x2).toFixed(2) || px2 > +Math.max(x1, x2).toFixed(2) || px2 < +Math.min(x3, x4).toFixed(2) || px2 > +Math.max(x3, x4).toFixed(2) || py2 < +Math.min(y1, y2).toFixed(2) || py2 > +Math.max(y1, y2).toFixed(2) || py2 < +Math.min(y3, y4).toFixed(2) || py2 > +Math.max(y3, y4).toFixed(2)) {
    return;
  }
  return {
    x: px,
    y: py
  };
};

var isPointInsideBBox = function isPointInsideBBox(bbox, x, y) {
  return x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
};

var box = function box(x, y, width, height) {
  if (x === null) {
    x = y = width = height = 0;
  }
  if (y === null) {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  return {
    x: x,
    y: y,
    width: width,
    w: width,
    height: height,
    h: height,
    x2: x + width,
    y2: y + height,
    cx: x + width / 2,
    cy: y + height / 2,
    r1: Math.min(width, height) / 2,
    r2: Math.max(width, height) / 2,
    r0: Math.sqrt(width * width + height * height) / 2,
    path: rectPath(x, y, width, height),
    vb: [x, y, width, height].join(' ')
  };
};

var isBBoxIntersect = function isBBoxIntersect(bbox1, bbox2) {
  bbox1 = box(bbox1);
  bbox2 = box(bbox2);
  return isPointInsideBBox(bbox2, bbox1.x, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
};

var bezierBBox = function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
  if (!isArray(p1x)) {
    p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
  }
  var bbox = curveDim.apply(null, p1x);
  return box(bbox.min.x, bbox.min.y, bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y);
};

var findDotsAtSegment = function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  var t1 = 1 - t;
  var t13 = Math.pow(t1, 3);
  var t12 = Math.pow(t1, 2);
  var t2 = t * t;
  var t3 = t2 * t;
  var x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x;
  var y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y;
  var mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x);
  var my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y);
  var nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x);
  var ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y);
  var ax = t1 * p1x + t * c1x;
  var ay = t1 * p1y + t * c1y;
  var cx = t1 * c2x + t * p2x;
  var cy = t1 * c2y + t * p2y;
  var alpha = 90 - Math.atan2(mx - nx, my - ny) * 180 / Math.PI;
  // (mx > nx || my < ny) && (alpha += 180);
  return {
    x: x,
    y: y,
    m: {
      x: mx,
      y: my
    },
    n: {
      x: nx,
      y: ny
    },
    start: {
      x: ax,
      y: ay
    },
    end: {
      x: cx,
      y: cy
    },
    alpha: alpha
  };
};

var interHelper = function interHelper(bez1, bez2, justCount) {
  var bbox1 = bezierBBox(bez1);
  var bbox2 = bezierBBox(bez2);
  if (!isBBoxIntersect(bbox1, bbox2)) {
    return justCount ? 0 : [];
  }
  var l1 = bezlen.apply(0, bez1);
  var l2 = bezlen.apply(0, bez2);
  var n1 = ~~(l1 / 8);
  var n2 = ~~(l2 / 8);
  var dots1 = [];
  var dots2 = [];
  var xy = {};
  var res = justCount ? 0 : [];
  for (var i = 0; i < n1 + 1; i++) {
    var d = findDotsAtSegment.apply(0, bez1.concat(i / n1));
    dots1.push({
      x: d.x,
      y: d.y,
      t: i / n1
    });
  }
  for (var _i = 0; _i < n2 + 1; _i++) {
    var _d = findDotsAtSegment.apply(0, bez2.concat(_i / n2));
    dots2.push({
      x: _d.x,
      y: _d.y,
      t: _i / n2
    });
  }
  for (var _i2 = 0; _i2 < n1; _i2++) {
    for (var j = 0; j < n2; j++) {
      var di = dots1[_i2];
      var di1 = dots1[_i2 + 1];
      var dj = dots2[j];
      var dj1 = dots2[j + 1];
      var ci = Math.abs(di1.x - di.x) < 0.001 ? 'y' : 'x';
      var cj = Math.abs(dj1.x - dj.x) < 0.001 ? 'y' : 'x';
      var is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
      if (is) {
        if (xy[is.x.toFixed(4)] === is.y.toFixed(4)) {
          continue;
        }
        xy[is.x.toFixed(4)] = is.y.toFixed(4);
        var t1 = di.t + Math.abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t);
        var t2 = dj.t + Math.abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
        if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
          if (justCount) {
            res++;
          } else {
            res.push({
              x: is.x,
              y: is.y,
              t1: t1,
              t2: t2
            });
          }
        }
      }
    }
  }
  return res;
};

var interPathHelper = function interPathHelper(path1, path2, justCount) {
  path1 = pathTocurve(path1);
  path2 = pathTocurve(path2);
  var x1 = void 0;
  var y1 = void 0;
  var x2 = void 0;
  var y2 = void 0;
  var x1m = void 0;
  var y1m = void 0;
  var x2m = void 0;
  var y2m = void 0;
  var bez1 = void 0;
  var bez2 = void 0;
  var res = justCount ? 0 : [];
  for (var i = 0, ii = path1.length; i < ii; i++) {
    var pi = path1[i];
    if (pi[0] === 'M') {
      x1 = x1m = pi[1];
      y1 = y1m = pi[2];
    } else {
      if (pi[0] === 'C') {
        bez1 = [x1, y1].concat(pi.slice(1));
        x1 = bez1[6];
        y1 = bez1[7];
      } else {
        bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
        x1 = x1m;
        y1 = y1m;
      }
      for (var j = 0, jj = path2.length; j < jj; j++) {
        var pj = path2[j];
        if (pj[0] === 'M') {
          x2 = x2m = pj[1];
          y2 = y2m = pj[2];
        } else {
          if (pj[0] === 'C') {
            bez2 = [x2, y2].concat(pj.slice(1));
            x2 = bez2[6];
            y2 = bez2[7];
          } else {
            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
            x2 = x2m;
            y2 = y2m;
          }
          var intr = interHelper(bez1, bez2, justCount);
          if (justCount) {
            res += intr;
          } else {
            for (var k = 0, kk = intr.length; k < kk; k++) {
              intr[k].segment1 = i;
              intr[k].segment2 = j;
              intr[k].bez1 = bez1;
              intr[k].bez2 = bez2;
            }
            res = res.concat(intr);
          }
        }
      }
    }
  }
  return res;
};

module.exports = function pathIntersection(path1, path2) {
  return interPathHelper(path1, path2);
};