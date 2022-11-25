"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerShape = void 0;

var CustomizeUtils = _interopRequireWildcard(require("../utils/CustomizeUtils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DEFAULT_SANKEY_SHAPE = 'sankey';

function interpolationGenerator(a, b) {
  var ka = +a;
  var kb = b - ka;
  return function (t) {
    return ka + kb * t;
  };
}

function getCurvePath(from, to, curvature) {
  var interpolationFunc = interpolationGenerator(from.x, to.x);
  var fromCtrlX = interpolationFunc(curvature);
  var toCtrlX = interpolationFunc(1 - curvature);
  var points = ['C', fromCtrlX, from.y, toCtrlX, to.y, to.x, to.y];
  return points;
}

function getEdgePath(points, curvature) {
  var path = [['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y]];
  var c1 = getCurvePath(points[1], points[3], curvature);
  path.push(c1);
  path.push(['L', points[3].x, points[3].y]);
  path.push(['L', points[2].x, points[2].y]);
  var c2 = getCurvePath(points[2], points[0], curvature);
  path.push(c2);
  path.push(['Z']);
  return path;
}

var registerShape = function registerShape() {
  CustomizeUtils.registerShape('edge', DEFAULT_SANKEY_SHAPE, {
    drawShape: function drawShape(cfg, group) {
      var points = cfg.points,
          style = cfg.style;
      var curvature = style.curvature || 0.5;
      var path = this.parsePath(getEdgePath(points, curvature));
      var shape = group.addShape('path', {
        attrs: {
          stroke: 'none',
          strokeOpacity: 0,
          fill: cfg.color,
          opacity: cfg.opacity,
          path: path
        }
      });
      return shape;
    }
  });
};

exports.registerShape = registerShape;