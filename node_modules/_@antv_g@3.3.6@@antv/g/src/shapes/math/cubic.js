const Util = require('../../util/index');
const vec2 = Util.vec2;

function cubicAt(p0, p1, p2, p3, t) {
  const onet = 1 - t;
  return onet * onet * (onet * p3 + 3 * t * p2) + t * t * (t * p0 + 3 * onet * p1);
}

function cubicDerivativeAt(p0, p1, p2, p3, t) {
  const onet = 1 - t;
  return 3 * (
    ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet +
    (p3 - p2) * t * t
  );
}

function cubicProjectPoint(x1, y1, x2, y2, x3, y3, x4, y4, x, y, out) {
  let t;
  let interval = 0.005;
  let d = Infinity;
  let _t;
  let v1;
  let d1;
  let d2;
  let v2;
  let prev;
  let next;
  const EPSILON = 0.0001;
  const v0 = [ x, y ];

  for (_t = 0; _t < 1; _t += 0.05) {
    v1 = [
      cubicAt(x1, x2, x3, x4, _t),
      cubicAt(y1, y2, y3, y4, _t)
    ];

    d1 = vec2.squaredDistance(v0, v1);
    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }
  d = Infinity;

  for (let i = 0; i < 32; i++) {
    if (interval < EPSILON) {
      break;
    }

    prev = t - interval;
    next = t + interval;

    v1 = [
      cubicAt(x1, x2, x3, x4, prev),
      cubicAt(y1, y2, y3, y4, prev)
    ];

    d1 = vec2.squaredDistance(v0, v1);


    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      v2 = [
        cubicAt(x1, x2, x3, x4, next),
        cubicAt(y1, y2, y3, y4, next)
      ];

      d2 = vec2.squaredDistance(v0, v2);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  }

  if (out) {
    out.x = cubicAt(x1, x2, x3, x4, t);
    out.y = cubicAt(y1, y2, y3, y4, t);
  }

  return Math.sqrt(d);
}

function cubicExtrema(p0, p1, p2, p3) {
  const a = 3 * p0 - 9 * p1 + 9 * p2 - 3 * p3;
  const b = 6 * p1 - 12 * p2 + 6 * p3;
  const c = 3 * p2 - 3 * p3;
  const extrema = [];
  let t1;
  let t2;
  let discSqrt;

  if (Util.isNumberEqual(a, 0)) {
    if (!Util.isNumberEqual(b, 0)) {
      t1 = -c / b;
      if (t1 >= 0 && t1 <= 1) {
        extrema.push(t1);
      }
    }
  } else {
    const disc = b * b - 4 * a * c;
    if (Util.isNumberEqual(disc, 0)) {
      extrema.push(-b / (2 * a));
    } else if (disc > 0) {
      discSqrt = Math.sqrt(disc);
      t1 = (-b + discSqrt) / (2 * a);
      t2 = (-b - discSqrt) / (2 * a);
      if (t1 >= 0 && t1 <= 1) {
        extrema.push(t1);
      }
      if (t2 >= 0 && t2 <= 1) {
        extrema.push(t2);
      }
    }
  }
  return extrema;
}

function base3(t, p1, p2, p3, p4) {
  const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
  const t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
}

function cubiclLen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
  if (Util.isNil(z)) {
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
}


module.exports = {
  at: cubicAt,
  derivativeAt: cubicDerivativeAt,
  projectPoint(x1, y1, x2, y2, x3, y3, x4, y4, x, y) {
    const rst = {};
    cubicProjectPoint(x1, y1, x2, y2, x3, y3, x4, y4, x, y, rst);
    return rst;
  },
  pointDistance: cubicProjectPoint,
  extrema: cubicExtrema,
  len: cubiclLen
};
