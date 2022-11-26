const parsePathString = require('./parse-path-string');
const catmullRom2bezier = require('./catmull-rom2bezier');

function ellipsePath(x, y, rx, ry, a) {
  let res = [];
  if (a === null && ry === null) {
    ry = rx;
  }
  x = +x;
  y = +y;
  rx = +rx;
  ry = +ry;
  if (a !== null) {
    const rad = Math.PI / 180;
    const x1 = x + rx * Math.cos(-ry * rad);
    const x2 = x + rx * Math.cos(-a * rad);
    const y1 = y + rx * Math.sin(-ry * rad);
    const y2 = y + rx * Math.sin(-a * rad);
    res = [
      [ 'M', x1, y1 ],
      [ 'A', rx, rx, 0, +(a - ry > 180), 0, x2, y2 ]
    ];
  } else {
    res = [
      [ 'M', x, y ],
      [ 'm', 0, -ry ],
      [ 'a', rx, ry, 0, 1, 1, 0, 2 * ry ],
      [ 'a', rx, ry, 0, 1, 1, 0, -2 * ry ],
      [ 'z' ]
    ];
  }
  return res;
}

module.exports = function pathToAbsolute(pathArray) {
  pathArray = parsePathString(pathArray);

  if (!pathArray || !pathArray.length) {
    return [
      [ 'M', 0, 0 ]
    ];
  }
  let res = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let start = 0;
  let pa0;
  let dots;
  if (pathArray[0][0] === 'M') {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = [ 'M', x, y ];
  }
  const crz = pathArray.length === 3 &&
    pathArray[0][0] === 'M' &&
    pathArray[1][0].toUpperCase() === 'R' &&
    pathArray[2][0].toUpperCase() === 'Z';
  for (let r, pa, i = start, ii = pathArray.length; i < ii; i++) {
    res.push(r = []);
    pa = pathArray[i];
    pa0 = pa[0];
    if (pa0 !== pa0.toUpperCase()) {
      r[0] = pa0.toUpperCase();
      switch (r[0]) {
        case 'A':
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case 'V':
          r[1] = +pa[1] + y;
          break;
        case 'H':
          r[1] = +pa[1] + x;
          break;
        case 'R':
          dots = [ x, y ].concat(pa.slice(1));
          for (let j = 2, jj = dots.length; j < jj; j++) {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y;
          }
          res.pop();
          res = res.concat(catmullRom2bezier(dots, crz));
          break;
        case 'O':
          res.pop();
          dots = ellipsePath(x, y, pa[1], pa[2]);
          dots.push(dots[0]);
          res = res.concat(dots);
          break;
        case 'U':
          res.pop();
          res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
          r = [ 'U' ].concat(res[res.length - 1].slice(-2));
          break;
        case 'M':
          mx = +pa[1] + x;
          my = +pa[2] + y;
          break; // for lint
        default:
          for (let j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] + ((j % 2) ? x : y);
          }
      }
    } else if (pa0 === 'R') {
      dots = [ x, y ].concat(pa.slice(1));
      res.pop();
      res = res.concat(catmullRom2bezier(dots, crz));
      r = [ 'R' ].concat(pa.slice(-2));
    } else if (pa0 === 'O') {
      res.pop();
      dots = ellipsePath(x, y, pa[1], pa[2]);
      dots.push(dots[0]);
      res = res.concat(dots);
    } else if (pa0 === 'U') {
      res.pop();
      res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
      r = [ 'U' ].concat(res[res.length - 1].slice(-2));
    } else {
      for (let k = 0, kk = pa.length; k < kk; k++) {
        r[k] = pa[k];
      }
    }
    pa0 = pa0.toUpperCase();
    if (pa0 !== 'O') {
      switch (r[0]) {
        case 'Z':
          x = +mx;
          y = +my;
          break;
        case 'H':
          x = r[1];
          break;
        case 'V':
          y = r[1];
          break;
        case 'M':
          mx = r[r.length - 2];
          my = r[r.length - 1];
          break; // for lint
        default:
          x = r[r.length - 2];
          y = r[r.length - 1];
      }
    }
  }

  return res;
};
