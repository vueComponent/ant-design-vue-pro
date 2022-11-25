"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _PolarUtils = require("../utils/PolarUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function setPolarCoord(chart, coord) {
  var newCoord = {};

  if (coord.radius && (coord.radius < 0 || coord.radius > 1) || coord.innerRadius && (coord.innerRadius < 0 || coord.innerRadius > 1)) {
    throw new Error('please set correct radius or innerRadius');
  }

  if (coord.radius) {
    newCoord = __assign({}, newCoord, {
      radius: coord.radius
    });
  }

  if (coord.innerRadius) {
    newCoord = __assign({}, newCoord, {
      innerRadius: coord.innerRadius
    });
  }

  if (coord.startAngle || coord.endAngle) {
    if (coord.startAngle && (coord.startAngle < -360 || coord.startAngle > 360)) {
      throw new Error('please set correct starAngle');
    } else {
      newCoord = __assign({}, newCoord, {
        startAngle: (0, _PolarUtils.degreeToRadian)(coord.startAngle)
      });
    }

    if (coord.endAngle && (coord.endAngle < -360 || coord.endAngle > 360)) {
      throw new Error('please set correct endAngle');
    } else {
      newCoord = __assign({}, newCoord, {
        endAngle: (0, _PolarUtils.degreeToRadian)(coord.endAngle)
      });
    }
  }

  var polarCoord = chart.coord(coord.type, __assign({}, newCoord));

  switch (coord.direction) {
    case 'rotate':
      polarCoord.transpose();
      break;

    case 'xReverse':
      polarCoord.reflect('x');
      break;

    case 'yReverse':
      polarCoord.reflect('y');
      break;

    case 'reverse':
      polarCoord.reflect();
      break;

    default:
      break;
  }

  if (coord.rotate) {
    polarCoord.rotate(coord.rotate);
  }

  return polarCoord;
}

function setRectCoord(chart, coord) {
  if (!coord.direction) {
    return chart.coord('rect');
  }

  switch (coord.direction) {
    case 'BL':
      chart.coord('rect');
      break;

    case 'BR':
      chart.coord('rect').scale(-1, 1);
      break;

    case 'LT':
      chart.coord('rect').transpose().scale(1, -1);
      break;

    case 'LB':
      chart.coord('rect').transpose();
      break;

    case 'RB':
      chart.coord('rect').transpose().reflect();
      break;

    case 'RT':
      chart.coord('rect').transpose().reflect().scale(-1, 1);
      break;

    case 'TL':
      chart.coord('rect').reflect();
      break;

    case 'TR':
      chart.coord('rect').reflect().scale(-1, 1);
      break;

    default:
      chart.coord('rect');
      break;
  }

  return chart;
}

var process = function process(chart, config) {
  var cCoord = (0, _cloneDeep2.default)(config.coord);

  if (!cCoord || !cCoord.type) {
    return chart.coord('rect');
  }

  var type = cCoord.type;

  if (type === 'polar' || type === 'theta' || type === 'helix') {
    return setPolarCoord(chart, cCoord);
  }

  if (type === 'rect') {
    return setRectCoord(chart, cCoord);
  }

  return chart.coord(type);
};

exports.process = process;