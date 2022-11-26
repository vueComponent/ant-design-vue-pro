const isArray = require('../type/is-array');
const rectPath = require('./rect-path');
const pathTocurve = require('./path2curve');

const base3 = function(t, p1, p2, p3, p4) {
  const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
  const t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
};

const bezlen = function(x1, y1, x2, y2, x3, y3, x4, y4, z) {
  if (z === null) {
    z = 1;
  }
  z = z > 1 ? 1 : z < 0 ? 0 : z;
  const z2 = z / 2;
  const n = 12;
  const Tvalues = [ -0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816 ];
  const Cvalues = [ 0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472 ];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const ct = z2 * Tvalues[i] + z2;
    const xbase = base3(ct, x1, x2, x3, x4);
    const ybase = base3(ct, y1, y2, y3, y4);
    const comb = xbase * xbase + ybase * ybase;
    sum += Cvalues[i] * Math.sqrt(comb);
  }
  return z2 * sum;
};

const curveDim = function(x0, y0, x1, y1, x2, y2, x3, y3) {
  const tvalues = [];
  const bounds = [
    [],
    []
  ];
  let a;
  let b;
  let c;
  let t;

  for (let i = 0; i < 2; ++i) {
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
    const b2ac = b * b - 4 * c * a;
    const sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    const t1 = (-b + sqrtb2ac) / (2 * a);
    if (t1 > 0 && t1 < 1) {
      tvalues.push(t1);
    }
    const t2 = (-b - sqrtb2ac) / (2 * a);
    if (t2 > 0 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let j = tvalues.length;
  const jlen = j;
  let mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
    bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
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

const intersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.min(x1, x2) > Math.max(x3, x4) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.min(y1, y2) > Math.max(y3, y4)
  ) {
    return;
  }
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (!denominator) {
    return;
  }
  const px = nx / denominator;
  const py = ny / denominator;
  const px2 = +px.toFixed(2);
  const py2 = +py.toFixed(2);
  if (
    px2 < +Math.min(x1, x2).toFixed(2) ||
    px2 > +Math.max(x1, x2).toFixed(2) ||
    px2 < +Math.min(x3, x4).toFixed(2) ||
    px2 > +Math.max(x3, x4).toFixed(2) ||
    py2 < +Math.min(y1, y2).toFixed(2) ||
    py2 > +Math.max(y1, y2).toFixed(2) ||
    py2 < +Math.min(y3, y4).toFixed(2) ||
    py2 > +Math.max(y3, y4).toFixed(2)
  ) {
    return;
  }
  return {
    x: px,
    y: py
  };
};

const isPointInsideBBox = function(bbox, x, y) {
  return x >= bbox.x &&
    x <= bbox.x + bbox.width &&
    y >= bbox.y &&
    y <= bbox.y + bbox.height;
};


const box = function(x, y, width, height) {
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
    x,
    y,
    width,
    w: width,
    height,
    h: height,
    x2: x + width,
    y2: y + height,
    cx: x + width / 2,
    cy: y + height / 2,
    r1: Math.min(width, height) / 2,
    r2: Math.max(width, height) / 2,
    r0: Math.sqrt(width * width + height * height) / 2,
    path: rectPath(x, y, width, height),
    vb: [ x, y, width, height ].join(' ')
  };
};

const isBBoxIntersect = function(bbox1, bbox2) {
  bbox1 = box(bbox1);
  bbox2 = box(bbox2);
  return isPointInsideBBox(bbox2, bbox1.x, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
};

const bezierBBox = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
  if (!isArray(p1x)) {
    p1x = [ p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y ];
  }
  const bbox = curveDim.apply(null, p1x);
  return box(
    bbox.min.x,
    bbox.min.y,
    bbox.max.x - bbox.min.x,
    bbox.max.y - bbox.min.y
  );
};

const findDotsAtSegment = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  const t1 = 1 - t;
  const t13 = Math.pow(t1, 3);
  const t12 = Math.pow(t1, 2);
  const t2 = t * t;
  const t3 = t2 * t;
  const x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x;
  const y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y;
  const mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x);
  const my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y);
  const nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x);
  const ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y);
  const ax = t1 * p1x + t * c1x;
  const ay = t1 * p1y + t * c1y;
  const cx = t1 * c2x + t * p2x;
  const cy = t1 * c2y + t * p2y;
  const alpha = (90 - Math.atan2(mx - nx, my - ny) * 180 / Math.PI);
  // (mx > nx || my < ny) && (alpha += 180);
  return {
    x,
    y,
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
    alpha
  };
};


const interHelper = function(bez1, bez2, justCount) {
  const bbox1 = bezierBBox(bez1);
  const bbox2 = bezierBBox(bez2);
  if (!isBBoxIntersect(bbox1, bbox2)) {
    return justCount ? 0 : [];
  }
  const l1 = bezlen.apply(0, bez1);
  const l2 = bezlen.apply(0, bez2);
  const n1 = ~~(l1 / 8);
  const n2 = ~~(l2 / 8);
  const dots1 = [];
  const dots2 = [];
  const xy = {};
  let res = justCount ? 0 : [];
  for (let i = 0; i < n1 + 1; i++) {
    const d = findDotsAtSegment.apply(0, bez1.concat(i / n1));
    dots1.push({
      x: d.x,
      y: d.y,
      t: i / n1
    });
  }
  for (let i = 0; i < n2 + 1; i++) {
    const d = findDotsAtSegment.apply(0, bez2.concat(i / n2));
    dots2.push({
      x: d.x,
      y: d.y,
      t: i / n2
    });
  }
  for (let i = 0; i < n1; i++) {
    for (let j = 0; j < n2; j++) {
      const di = dots1[i];
      const di1 = dots1[i + 1];
      const dj = dots2[j];
      const dj1 = dots2[j + 1];
      const ci = Math.abs(di1.x - di.x) < 0.001 ? 'y' : 'x';
      const cj = Math.abs(dj1.x - dj.x) < 0.001 ? 'y' : 'x';
      const is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
      if (is) {
        if (xy[is.x.toFixed(4)] === is.y.toFixed(4)) {
          continue;
        }
        xy[is.x.toFixed(4)] = is.y.toFixed(4);
        const t1 = di.t + Math.abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t);
        const t2 = dj.t + Math.abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
        if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
          if (justCount) {
            res++;
          } else {
            res.push({
              x: is.x,
              y: is.y,
              t1,
              t2
            });
          }
        }
      }
    }
  }
  return res;
};

const interPathHelper = function(path1, path2, justCount) {
  path1 = pathTocurve(path1);
  path2 = pathTocurve(path2);
  let x1;
  let y1;
  let x2;
  let y2;
  let x1m;
  let y1m;
  let x2m;
  let y2m;
  let bez1;
  let bez2;
  let res = justCount ? 0 : [];
  for (let i = 0, ii = path1.length; i < ii; i++) {
    const pi = path1[i];
    if (pi[0] === 'M') {
      x1 = x1m = pi[1];
      y1 = y1m = pi[2];
    } else {
      if (pi[0] === 'C') {
        bez1 = [ x1, y1 ].concat(pi.slice(1));
        x1 = bez1[6];
        y1 = bez1[7];
      } else {
        bez1 = [ x1, y1, x1, y1, x1m, y1m, x1m, y1m ];
        x1 = x1m;
        y1 = y1m;
      }
      for (let j = 0, jj = path2.length; j < jj; j++) {
        const pj = path2[j];
        if (pj[0] === 'M') {
          x2 = x2m = pj[1];
          y2 = y2m = pj[2];
        } else {
          if (pj[0] === 'C') {
            bez2 = [ x2, y2 ].concat(pj.slice(1));
            x2 = bez2[6];
            y2 = bez2[7];
          } else {
            bez2 = [ x2, y2, x2, y2, x2m, y2m, x2m, y2m ];
            x2 = x2m;
            y2 = y2m;
          }
          const intr = interHelper(bez1, bez2, justCount);
          if (justCount) {
            res += intr;
          } else {
            for (let k = 0, kk = intr.length; k < kk; k++) {
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

