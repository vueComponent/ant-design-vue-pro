"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _sortBy2 = _interopRequireDefault(require("lodash/sortBy"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isBoolean2 = _interopRequireDefault(require("lodash/isBoolean"));

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var EventUtils = _interopRequireWildcard(require("../utils/EventUtils"));

var setCustomFormatter = _interopRequireWildcard(require("./setCustomFormatter"));

var setQuickType = _interopRequireWildcard(require("./setQuickType"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setSeriesGemo(chart, currSeries) {
  var gemo = currSeries.gemo;

  switch (gemo) {
    case 'line':
      chart = chart.line();
      break;

    case 'area':
      chart = chart.area();
      break;

    case 'bar':
    case 'interval':
      chart = chart.interval();
      break;

    case 'point':
      chart = chart.point();
      break;

    case 'schema':
      chart = chart.schema();
      break;

    case 'polygon':
      chart = chart.polygon();
      break;

    case 'contour':
      chart = chart.contour();
      break;

    case 'heatmap':
      chart = chart.heatmap();
      break;

    case 'edge':
      chart = chart.edge();
      break;

    case 'path':
      chart = chart.path();
      break;

    case 'venn':
      chart = chart.venn();
      break;

    default:
      chart = chart.line();
  }

  return chart;
}

function setSeriesPosition(chart, currSeries) {
  var position = currSeries.position;

  if (!(0, _isNil2.default)(position)) {
    return chart.position(position);
  }

  return chart;
}

function setSeriesAdjust(chart, currSeries) {
  var adjust = currSeries.adjust;

  if (!(0, _isNil2.default)(adjust)) {
    return chart.adjust(adjust);
  }

  return chart;
}

function setSeriesShape(chart, currSeries) {
  var shape = currSeries.shape;

  if ((0, _isString2.default)(shape)) {
    return chart.shape(shape);
  }

  if ((0, _isArray2.default)(shape) && shape.length >= 1) {
    if (shape[1]) {
      return chart.shape(shape[0], shape[1]);
    }

    return chart.shape(shape[0]);
  }

  return chart;
}

function setSeriesColor(chart, currSeries) {
  var color = currSeries.color;

  if ((0, _isString2.default)(color)) {
    return chart.color(color);
  }

  if ((0, _isArray2.default)(color) && color.length >= 1) {
    if (color[1]) {
      return chart.color(color[0], color[1]);
    }

    return chart.color(color[0]);
  }

  return chart;
}

function setSeriesSize(chart, currSeries) {
  var size = currSeries.size;

  if ((0, _isNumber2.default)(size) || (0, _isString2.default)(size)) {
    return chart.size(size);
  }

  if ((0, _isArray2.default)(size) && size.length >= 1) {
    if (size[1]) {
      return chart.size(size[0], size[1]);
    }

    return chart.size(size[0]);
  }

  return chart;
}

function setSeriesOpacity(chart, currSeries) {
  var opacity = currSeries.opacity;

  if ((0, _isNumber2.default)(opacity) || (0, _isString2.default)(opacity)) {
    return chart.opacity(opacity);
  }

  if ((0, _isArray2.default)(opacity) && opacity.length >= 1) {
    if (opacity[1]) {
      return chart.opacity(opacity[0], opacity[1]);
    }

    return chart.opacity(opacity[0]);
  }

  return chart;
}

function setSeriesLabel(chart, currSeries) {
  var label = currSeries.label;

  if ((0, _isString2.default)(label)) {
    return chart.label(label);
  }

  if ((0, _isArray2.default)(label) && label.length >= 2) {
    if ((0, _isNumber2.default)(label[1].density) && 0 < label[1].density && label[1].density < 1 && ((0, _isFunction2.default)(label[1].formatter) || (0, _isString2.default)(label[1].formatter))) {
      var gap_1 = Math.floor(1 / label[1].density);
      var formatter_1 = (0, _isString2.default)(label[1].formatter) ? setCustomFormatter.supportD3Formatter(label[1]).formatter : label[1].formatter;

      label[1].formatter = function (val, item, i) {
        if (i % gap_1) {
          return ' ';
        } else {
          return formatter_1(val, item, i);
        }
      };
    }

    return chart.label.apply(chart, label);
  }

  return chart;
}

function setSeriesStyle(chart, currSeries) {
  var style = currSeries.style;

  if ((0, _isArray2.default)(style) && style.length >= 1) {
    if (style[1]) {
      return chart.style(style[0], style[1]);
    }

    return chart.style(style[0]);
  }

  if ((0, _isPlainObject2.default)(style)) {
    return chart.style(style);
  }

  return chart;
}

function setSeriesTooltip(chart, currSeries) {
  var tooltip = currSeries.tooltip;

  if ((0, _isBoolean2.default)(tooltip) || (0, _isString2.default)(tooltip)) {
    return chart.tooltip(tooltip);
  }

  if ((0, _isArray2.default)(tooltip) && tooltip.length >= 1) {
    if (tooltip[1]) {
      return chart.tooltip(tooltip[0], tooltip[1]);
    }

    return chart.tooltip(tooltip[0]);
  }

  return chart;
}

function setSeriesSelect(chart, currSeries) {
  var select = currSeries.select;

  if ((0, _isBoolean2.default)(select)) {
    return chart.select(select);
  }

  if ((0, _isArray2.default)(select) && select.length >= 1) {
    if (select[1]) {
      return chart.select(select[0], select[1]);
    }

    return chart.select(select[0]);
  }

  return chart;
}

function setSeriesActive(chart, currSeries) {
  var active = currSeries.active;

  if ((0, _isArray2.default)(active)) {
    return chart.active.apply(chart, active);
  }

  if ((0, _isBoolean2.default)(active) || (0, _isPlainObject2.default)(active)) {
    return chart.active(active);
  }

  return chart;
}

function setSeriesAnimate(chart, currSeries) {
  var animate = currSeries.animate;

  if (!(0, _isEmpty2.default)(animate)) {
    return chart.animate(animate);
  }

  return chart;
}

var process = function process(chart, config, isUpdate) {
  if (isUpdate === void 0) {
    isUpdate = false;
  }

  var cSeries = (0, _cloneDeep2.default)(config.series);
  var isArr = (0, _isArray2.default)(cSeries);

  if ((0, _isNil2.default)(cSeries) || (0, _isEmpty2.default)(cSeries)) {
    return chart;
  }

  var arrSeries = isArr ? cSeries : [cSeries];
  arrSeries = setQuickType.process(arrSeries, config.coord);
  arrSeries = (0, _sortBy2.default)(arrSeries, 'zIndex');
  var chartInstance;
  arrSeries.forEach(function (currSeries) {
    if (!isUpdate) {
      EventUtils.setEvent(chart, currSeries.gemo, currSeries);
    }

    for (var item in currSeries) {
      if (currSeries.hasOwnProperty(item)) {
        EventUtils.setSEvent(chart, 'label', name, currSeries[item]);
      }
    }

    chartInstance = setSeriesGemo(chart, currSeries);
    chartInstance = setSeriesPosition(chartInstance, currSeries);
    chartInstance = setSeriesAdjust(chartInstance, currSeries);
    chartInstance = setSeriesShape(chartInstance, currSeries);
    chartInstance = setSeriesColor(chartInstance, currSeries);
    chartInstance = setSeriesOpacity(chartInstance, currSeries);
    chartInstance = setSeriesSize(chartInstance, currSeries);
    chartInstance = setSeriesLabel(chartInstance, currSeries);
    chartInstance = setSeriesTooltip(chartInstance, currSeries);
    chartInstance = setSeriesStyle(chartInstance, currSeries);
    chartInstance = setSeriesSelect(chartInstance, currSeries);
    chartInstance = setSeriesActive(chartInstance, currSeries);
    chartInstance = setSeriesAnimate(chartInstance, currSeries);
  });
  return chartInstance;
};

exports.process = process;