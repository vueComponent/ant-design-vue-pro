const pathToAbsolute = require('./path2absolute');

const a2c = function(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  if (rx === ry) {
    rx += 1;
  }

  const _120 = Math.PI * 120 / 180;
  const rad = Math.PI / 180 * (+angle || 0);
  let res = [];
  let xy;
  let f1;
  let f2;
  let cx;
  let cy;
  const rotate = function(x, y, rad) {
    const X = x * Math.cos(rad) - y * Math.sin(rad);
    const Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {
      x: X,
      y: Y
    };
  };
  if (!recursive) {
    xy = rotate(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotate(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;
    if (x1 === x2 && y1 === y2) { // 若弧的起始点和终点重叠则错开一点
      x2 += 1;
      y2 += 1;
    }
    // const cos = Math.cos(Math.PI / 180 * angle);
    // const sin = Math.sin(Math.PI / 180 * angle);
    const x = (x1 - x2) / 2;
    const y = (y1 - y2) / 2;
    let h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    const k = (large_arc_flag === sweep_flag ? -1 : 1) *
      Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)));
    cx = k * rx * y / ry + (x1 + x2) / 2;
    cy = k * -ry * x / rx + (y1 + y2) / 2;
    f1 = Math.asin(((y1 - cy) / ry).toFixed(9));
    f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    f1 < 0 && (f1 = Math.PI * 2 + f1);
    f2 < 0 && (f2 = Math.PI * 2 + f2);
    if (sweep_flag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweep_flag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  } else {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  }
  let df = f2 - f1;
  if (Math.abs(df) > _120) {
    const f2old = f2;
    const x2old = x2;
    const y2old = y2;
    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [ f2, f2old, cx, cy ]);
  }
  df = f2 - f1;
  const c1 = Math.cos(f1);
  const s1 = Math.sin(f1);
  const c2 = Math.cos(f2);
  const s2 = Math.sin(f2);
  const t = Math.tan(df / 4);
  const hx = 4 / 3 * rx * t;
  const hy = 4 / 3 * ry * t;
  const m1 = [ x1, y1 ];
  const m2 = [ x1 + hx * s1, y1 - hy * c1 ];
  const m3 = [ x2 + hx * s2, y2 - hy * c2 ];
  const m4 = [ x2, y2 ];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [ m2, m3, m4 ].concat(res);
  }
  res = [ m2, m3, m4 ].concat(res).join().split(',');
  const newres = [];
  for (let i = 0, ii = res.length; i < ii; i++) {
    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
  }
  return newres;

};


const l2c = function(x1, y1, x2, y2) {
  return [ x1, y1, x2, y2, x2, y2 ];
};

const q2c = function(x1, y1, ax, ay, x2, y2) {
  const _13 = 1 / 3;
  const _23 = 2 / 3;
  return [
    _13 * x1 + _23 * ax,
    _13 * y1 + _23 * ay,
    _13 * x2 + _23 * ax,
    _13 * y2 + _23 * ay,
    x2,
    y2
  ];
};

module.exports = function pathTocurve(path, path2) {
  const p = pathToAbsolute(path);
  const p2 = path2 && pathToAbsolute(path2);
  const attrs = {
    x: 0,
    y: 0,
    bx: 0,
    by: 0,
    X: 0,
    Y: 0,
    qx: null,
    qy: null
  };
  const attrs2 = {
    x: 0,
    y: 0,
    bx: 0,
    by: 0,
    X: 0,
    Y: 0,
    qx: null,
    qy: null
  };
  const pcoms1 = []; // path commands of original path p
  const pcoms2 = []; // path commands of original path p2
  let pfirst = ''; // temporary holder for original path command
  let pcom = ''; // holder for previous path command of original path
  let ii;
  const processPath = function(path, d, pcom) {
    let nx,
      ny;
    if (!path) {
      return [ 'C', d.x, d.y, d.x, d.y, d.x, d.y ];
    }!(path[0] in {
      T: 1,
      Q: 1
    }) && (d.qx = d.qy = null);
    switch (path[0]) {
      case 'M':
        d.X = path[1];
        d.Y = path[2];
        break;
      case 'A':
        path = [ 'C' ].concat(a2c.apply(0, [ d.x, d.y ].concat(path.slice(1))));
        break;
      case 'S':
        if (pcom === 'C' || pcom === 'S') { // In "S" case we have to take into account, if the previous command is C/S.
          nx = d.x * 2 - d.bx; // And reflect the previous
          ny = d.y * 2 - d.by; // command's control point relative to the current point.
        } else { // or some else or nothing
          nx = d.x;
          ny = d.y;
        }
        path = [ 'C', nx, ny ].concat(path.slice(1));
        break;
      case 'T':
        if (pcom === 'Q' || pcom === 'T') { // In "T" case we have to take into account, if the previous command is Q/T.
          d.qx = d.x * 2 - d.qx; // And make a reflection similar
          d.qy = d.y * 2 - d.qy; // to case "S".
        } else { // or something else or nothing
          d.qx = d.x;
          d.qy = d.y;
        }
        path = [ 'C' ].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
        break;
      case 'Q':
        d.qx = path[1];
        d.qy = path[2];
        path = [ 'C' ].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
        break;
      case 'L':
        path = [ 'C' ].concat(l2c(d.x, d.y, path[1], path[2]));
        break;
      case 'H':
        path = [ 'C' ].concat(l2c(d.x, d.y, path[1], d.y));
        break;
      case 'V':
        path = [ 'C' ].concat(l2c(d.x, d.y, d.x, path[1]));
        break;
      case 'Z':
        path = [ 'C' ].concat(l2c(d.x, d.y, d.X, d.Y));
        break;
      default:
        break;
    }
    return path;
  };
  const fixArc = function(pp, i) {
    if (pp[i].length > 7) {
      pp[i].shift();
      const pi = pp[i];
      while (pi.length) {
        pcoms1[i] = 'A'; // if created multiple C:s, their original seg is saved
        p2 && (pcoms2[i] = 'A'); // the same as above
        pp.splice(i++, 0, [ 'C' ].concat(pi.splice(0, 6)));
      }
      pp.splice(i, 1);
      ii = Math.max(p.length, p2 && p2.length || 0);
    }
  };
  const fixM = function(path1, path2, a1, a2, i) {
    if (path1 && path2 && path1[i][0] === 'M' && path2[i][0] !== 'M') {
      path2.splice(i, 0, [ 'M', a2.x, a2.y ]);
      a1.bx = 0;
      a1.by = 0;
      a1.x = path1[i][1];
      a1.y = path1[i][2];
      ii = Math.max(p.length, p2 && p2.length || 0);
    }
  };
  ii = Math.max(p.length, p2 && p2.length || 0);
  for (let i = 0; i < ii; i++) {

    p[i] && (pfirst = p[i][0]); // save current path command

    if (pfirst !== 'C') { // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pfirst; // Save current path command
      i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

    if (pcoms1[i] !== 'A' && pfirst === 'C') pcoms1[i] = 'C'; // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path

    fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

    if (p2) { // the same procedures is done to p2
      p2[i] && (pfirst = p2[i][0]);
      if (pfirst !== 'C') {
        pcoms2[i] = pfirst;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processPath(p2[i], attrs2, pcom);

      if (pcoms2[i] !== 'A' && pfirst === 'C') {
        pcoms2[i] = 'C';
      }

      fixArc(p2, i);
    }
    fixM(p, p2, attrs, attrs2, i);
    fixM(p2, p, attrs2, attrs, i);
    const seg = p[i];
    const seg2 = p2 && p2[i];
    const seglen = seg.length;
    const seg2len = p2 && seg2.length;
    attrs.x = seg[seglen - 2];
    attrs.y = seg[seglen - 1];
    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
    attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
    attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
    attrs2.x = p2 && seg2[seg2len - 2];
    attrs2.y = p2 && seg2[seg2len - 1];
  }

  return p2 ? [ p, p2 ] : p;
};
