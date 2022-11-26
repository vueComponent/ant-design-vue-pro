var MatrixUtil = require('../../util').MatrixUtil;

var Vector2 = MatrixUtil.vec2;

function smoothBezier(points, smooth, isLoop, constraint) {
  var cps = [];
  var prevPoint;
  var nextPoint;
  var hasConstraint = !!constraint;
  var min, max;

  if (hasConstraint) {
    min = [Infinity, Infinity];
    max = [-Infinity, -Infinity];

    for (var i = 0, l = points.length; i < l; i++) {
      var point = points[i];
      min = Vector2.min([], min, point);
      max = Vector2.max([], max, point);
    }

    min = Vector2.min([], min, constraint[0]);
    max = Vector2.max([], max, constraint[1]);
  }

  for (var _i = 0, len = points.length; _i < len; _i++) {
    var _point = points[_i];

    if (isLoop) {
      prevPoint = points[_i ? _i - 1 : len - 1];
      nextPoint = points[(_i + 1) % len];
    } else {
      if (_i === 0 || _i === len - 1) {
        cps.push(_point);
        continue;
      } else {
        prevPoint = points[_i - 1];
        nextPoint = points[_i + 1];
      }
    }

    var v = [];
    v = Vector2.sub(v, nextPoint, prevPoint);
    v = Vector2.scale(v, v, smooth);
    var d0 = Vector2.distance(_point, prevPoint);
    var d1 = Vector2.distance(_point, nextPoint);
    var sum = d0 + d1;

    if (sum !== 0) {
      d0 /= sum;
      d1 /= sum;
    }

    var v1 = Vector2.scale([], v, -d0);
    var v2 = Vector2.scale([], v, d1);
    var cp0 = Vector2.add([], _point, v1);
    var cp1 = Vector2.add([], _point, v2);

    if (hasConstraint) {
      cp0 = Vector2.max([], cp0, min);
      cp0 = Vector2.min([], cp0, max);
      cp1 = Vector2.max([], cp1, min);
      cp1 = Vector2.min([], cp1, max);
    }

    cps.push(cp0);
    cps.push(cp1);
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

function catmullRom2bezier(crp, z, constraint) {
  var isLoop = !!z;
  var pointList = [];

  for (var i = 0, l = crp.length; i < l; i += 2) {
    pointList.push([crp[i], crp[i + 1]]);
  }

  var controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
  var len = pointList.length;
  var d1 = [];
  var cp1;
  var cp2;
  var p;

  for (var _i2 = 0; _i2 < len - 1; _i2++) {
    cp1 = controlPointList[_i2 * 2];
    cp2 = controlPointList[_i2 * 2 + 1];
    p = pointList[_i2 + 1];
    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }

  if (isLoop) {
    cp1 = controlPointList[len];
    cp2 = controlPointList[len + 1];
    p = pointList[0];
    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }

  return d1;
}

module.exports = {
  catmullRom2bezier: catmullRom2bezier
};