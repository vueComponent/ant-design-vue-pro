"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerShape = void 0;

var CustomizeUtils = _interopRequireWildcard(require("../utils/CustomizeUtils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var DEFAULT_ERRORBAR_SHAPE = 'errorbar';

function renderBarPath(points) {
  return [['M', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['Z'], ['M', ((points[1].x || 0) + (points[2].x || 0)) / 2, ((points[1].y || 0) + (points[2].y || 0)) / 2], ['L', ((points[0].x || 0) + (points[3].x || 0)) / 2, ((points[0].y || 0) + (points[3].y || 0)) / 2], ['Z'], ['M', points[0].x, points[0].y], ['L', points[3].x, points[3].y], ['Z']];
}

var registerShape = function registerShape() {
  var barWidth = 1;
  var hasPoint = false;
  CustomizeUtils.registerShape('schema', DEFAULT_ERRORBAR_SHAPE, {
    getPoints: function getPoints(_a) {
      var _b = _a.x,
          x = _b === void 0 ? 0 : _b,
          _c = _a.y,
          y = _c === void 0 ? [0, 0, 0] : _c,
          _d = _a.size,
          size = _d === void 0 ? 0 : _d;
      return [{
        x: x - size / 2 * barWidth,
        y: y[0]
      }, {
        x: x - size / 2 * barWidth,
        y: y[2]
      }, {
        x: x + size / 2 * barWidth,
        y: y[2]
      }, {
        x: x + size / 2 * barWidth,
        y: y[0]
      }, {
        x: x,
        y: y[1]
      }, {
        x: x - size / 2 * barWidth,
        y: y[1]
      }];
    },
    drawShape: function drawShape(cfg, group) {
      var newGroup = group;
      var points = cfg.points;
      newGroup.addShape('path', {
        attrs: __assign({
          stroke: cfg.color,
          strokeOpacity: cfg.opacity || 1,
          lineWidth: cfg.style.lineWidth || 1,
          fill: cfg.color,
          opacity: cfg.opacity || 1,
          path: this.parsePath(renderBarPath(points))
        }, cfg.style)
      });

      if (hasPoint) {
        newGroup.addShape('circle', {
          attrs: __assign({
            stroke: cfg.color,
            strokeOpacity: cfg.opacity || 1,
            lineWidth: cfg.style.lineWidth || 1,
            fill: cfg.color,
            opacity: cfg.opacity || 1,
            x: this.parsePoint(points[4]).x,
            y: this.parsePoint(points[4]).y,
            r: cfg.style.lineWidth + 0.5 || 1.5
          }, cfg.style)
        });
      }

      return newGroup;
    }
  });
};

exports.registerShape = registerShape;