"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var EventUtils = _interopRequireWildcard(require("../utils/EventUtils"));

var setCustomFormatter = _interopRequireWildcard(require("./setCustomFormatter"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

function setRotatePolarAxis(chart, axisItem, coord, data) {
  var polarLabel = (0, _get2.default)(axisItem, 'polarLabel');
  var rotate = (0, _get2.default)(axisItem, 'polarLabel.rotate');

  if (!rotate) {
    return;
  }

  var tickStyle = {};

  if (rotate === 'parallel') {
    tickStyle = {
      rotate: coord.startAngle,
      textAlign: 'center'
    };
  } else if (rotate === 'normal') {
    tickStyle = {
      rotate: coord.startAngle + 90,
      textAlign: 'right'
    };
  }

  var offsetX = (0, _get2.default)(axisItem, 'polarLabel.offsetX');
  var offsetY = (0, _get2.default)(axisItem, 'polarLabel.offsetY');
  data.forEach(function (res, i) {
    chart.guide().text(__assign({
      position: [i, 0],
      content: data[i][axisItem.dataKey],
      style: __assign({
        polarLabel: polarLabel
      }, tickStyle)
    }, offsetX, offsetY));
  });
}

var process = function process(chart, config, isUpdate) {
  if (isUpdate === void 0) {
    isUpdate = false;
  }

  var cAxis = (0, _cloneDeep2.default)(config.axis);
  var isArr = (0, _isArray2.default)(cAxis);

  if ((0, _isNil2.default)(cAxis) || cAxis === false || isArr && cAxis.length === 0) {
    return chart.axis(false);
  }

  if (cAxis === true) {
    return chart.axis();
  }

  var arrAxis = isArr ? cAxis : [cAxis];
  var coord = config.coord,
      data = config.data;

  var _loop_1 = function _loop_1(res) {
    if (coord && coord.type === 'polar' && coord.direction === 'rotate') {
      setRotatePolarAxis(chart, res, coord, data);
    }

    if (res.label) {
      res.label = setCustomFormatter.supportD3Formatter(res.label);
    }

    if (!isUpdate) {
      for (var item in res) {
        if (res.hasOwnProperty(item)) {
          var name_1 = item === 'tickLine' ? 'ticks' : item;
          EventUtils.setSEvent(chart, 'axis', name_1, res[item]);
        }
      }
    }

    if (res.dataKey) {
      if (res.show === false) {
        chart.axis(res.dataKey, false);
      } else {
        var options = (0, _omit2.default)(res, ['show', 'dataKey']);
        var label = options.label;

        if (label && (0, _isNumber2.default)(label.density) && 0 < label.density && label.density < 1 && (0, _isFunction2.default)(label.formatter)) {
          var gap_1 = Math.floor(1 / label.density);
          var formatter_1 = label.formatter;

          options.label.formatter = function (val, item, i) {
            if (i % gap_1) {
              return ' ';
            } else {
              return formatter_1(val, item, i);
            }
          };
        }

        chart.axis(res.dataKey, options);
      }
    } else {
      chart.axis(res);
    }
  };

  for (var _i = 0, arrAxis_1 = arrAxis; _i < arrAxis_1.length; _i++) {
    var res = arrAxis_1[_i];

    _loop_1(res);
  }

  return chart;
};

exports.process = process;