const Util = require('../../util/index');

function circlePoint(cx, cy, r, angle) {
  return {
    x: Math.cos(angle) * r + cx,
    y: Math.sin(angle) * r + cy
  };
}

function angleNearTo(angle, min, max, out) {
  let v1;
  let v2;
  if (out) {
    if (angle < min) {
      v1 = min - angle;
      v2 = Math.PI * 2 - max + angle;
    } else if (angle > max) {
      v1 = Math.PI * 2 - angle + min;
      v2 = angle - max;
    }
  } else {
    v1 = angle - min;
    v2 = max - angle;
  }

  return v1 > v2 ? max : min;
}

function nearAngle(angle, startAngle, endAngle, clockwise) {
  let plus = 0;
  if (endAngle - startAngle >= Math.PI * 2) {
    plus = Math.PI * 2;
  }
  startAngle = Util.mod(startAngle, Math.PI * 2);
  endAngle = Util.mod(endAngle, Math.PI * 2) + plus;
  angle = Util.mod(angle, Math.PI * 2);
  if (clockwise) {
    if (startAngle >= endAngle) {
      if (angle > endAngle && angle < startAngle) {
        return angle;
      }
      return angleNearTo(angle, endAngle, startAngle, true);
    }
    if (angle < startAngle || angle > endAngle) {
      return angle;
    }
    return angleNearTo(angle, startAngle, endAngle);
  }
  if (startAngle <= endAngle) {
    if (startAngle < angle && angle < endAngle) {
      return angle;
    }
    return angleNearTo(angle, startAngle, endAngle, true);
  }
  if (angle > startAngle || angle < endAngle) {
    return angle;
  }
  return angleNearTo(angle, endAngle, startAngle);
}

function arcProjectPoint(cx, cy, r, startAngle, endAngle, clockwise, x, y, out) {
  const v = [ x, y ];
  const v0 = [ cx, cy ];
  const v1 = [ 1, 0 ];
  const subv = Util.vec2.subtract([], v, v0);
  let angle = Util.vec2.angleTo(v1, subv);

  angle = nearAngle(angle, startAngle, endAngle, clockwise);
  const vpoint = [ r * Math.cos(angle) + cx, r * Math.sin(angle) + cy ];
  if (out) {
    out.x = vpoint[0];
    out.y = vpoint[1];
  }
  const d = Util.vec2.distance(vpoint, v);
  return d;
}

function arcBox(cx, cy, r, startAngle, endAngle, clockwise) {
  const angleRight = 0;
  const angleBottom = Math.PI / 2;
  const angleLeft = Math.PI;
  const angleTop = Math.PI * 3 / 2;
  const points = [];
  let angle = nearAngle(angleRight, startAngle, endAngle, clockwise);
  if (angle === angleRight) {
    points.push(circlePoint(cx, cy, r, angleRight));
  }

  angle = nearAngle(angleBottom, startAngle, endAngle, clockwise);
  if (angle === angleBottom) {
    points.push(circlePoint(cx, cy, r, angleBottom));
  }

  angle = nearAngle(angleLeft, startAngle, endAngle, clockwise);
  if (angle === angleLeft) {
    points.push(circlePoint(cx, cy, r, angleLeft));
  }

  angle = nearAngle(angleTop, startAngle, endAngle, clockwise);
  if (angle === angleTop) {
    points.push(circlePoint(cx, cy, r, angleTop));
  }

  points.push(circlePoint(cx, cy, r, startAngle));
  points.push(circlePoint(cx, cy, r, endAngle));
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  Util.each(points, function(point) {
    if (minX > point.x) {
      minX = point.x;
    }
    if (maxX < point.x) {
      maxX = point.x;
    }
    if (minY > point.y) {
      minY = point.y;
    }
    if (maxY < point.y) {
      maxY = point.y;
    }
  });

  return {
    minX,
    minY,
    maxX,
    maxY
  };
}

module.exports = {
  nearAngle,
  projectPoint(cx, cy, r, startAngle, endAngle, clockwise, x, y) {
    const rst = {};
    arcProjectPoint(cx, cy, r, startAngle, endAngle, clockwise, x, y, rst);
    return rst;
  },
  pointDistance: arcProjectPoint,
  box: arcBox
};
