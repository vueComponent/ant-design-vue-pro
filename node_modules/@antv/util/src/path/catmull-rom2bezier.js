// http://schepers.cc/getting-to-the-point
module.exports = function catmullRom2bezier(crp, z) {
  const d = [];
  for (let i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
    const p = [{
      x: +crp[i - 2],
      y: +crp[i - 1]
    }, {
      x: +crp[i],
      y: +crp[i + 1]
    }, {
      x: +crp[i + 2],
      y: +crp[i + 3]
    }, {
      x: +crp[i + 4],
      y: +crp[i + 5]
    }];
    if (z) {
      if (!i) {
        p[0] = {
          x: +crp[iLen - 2],
          y: +crp[iLen - 1]
        };
      } else if (iLen - 4 === i) {
        p[3] = {
          x: +crp[0],
          y: +crp[1]
        };
      } else if (iLen - 2 === i) {
        p[2] = {
          x: +crp[0],
          y: +crp[1]
        };
        p[3] = {
          x: +crp[2],
          y: +crp[3]
        };
      }
    } else {
      if (iLen - 4 === i) {
        p[3] = p[2];
      } else if (!i) {
        p[0] = {
          x: +crp[i],
          y: +crp[i + 1]
        };
      }
    }
    d.push([ 'C',
      (-p[0].x + 6 * p[1].x + p[2].x) / 6,
      (-p[0].y + 6 * p[1].y + p[2].y) / 6,
      (p[1].x + 6 * p[2].x - p[3].x) / 6,
      (p[1].y + 6 * p[2].y - p[3].y) / 6,
      p[2].x,
      p[2].y
    ]);
  }

  return d;
};
