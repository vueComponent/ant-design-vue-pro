"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var EventUtils = _interopRequireWildcard(require("../utils/EventUtils"));

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

function setGuideLine(chart, item) {
  if (item.quickType === 'parallel') {
    var data = item.data;
    chart.guide().line(__assign({
      start: ['min', data],
      end: ['max', data]
    }, item));
  } else if (item.quickType === 'normal') {
    var data = item.data;
    chart.guide().line(__assign({
      start: [data, 'min'],
      end: [data, 'max']
    }, item));
  } else {
    chart.guide().line(item);
  }
}

function setGuideArc(chart, item) {
  if (item.quickType === 'parallel') {
    var data = item.data;
    chart.guide().arc(__assign({
      start: ['min', data],
      end: ['max', data]
    }, item));
    chart.guide().arc(__assign({
      start: ['max', data],
      end: ['min', data]
    }, item));
  } else if (item.quickType === 'normal') {
    var data = item.data;
    chart.guide().line(__assign({
      start: [data, 'min'],
      end: [data, 'max']
    }, item));
  } else {
    chart.guide().arc(item);
  }
}

var process = function process(chart, config, isUpdate) {
  if (isUpdate === void 0) {
    isUpdate = false;
  }

  var cGuide = (0, _cloneDeep2.default)(config.guide);
  var isArr = Array.isArray(cGuide);

  if ((0, _isNil2.default)(cGuide) || (0, _isEmpty2.default)(cGuide)) {
    return;
  }

  var arrGuide = isArr ? cGuide : [cGuide];
  arrGuide.forEach(function (res) {
    if (!isUpdate) {
      EventUtils.setEvent(chart, "guide-" + res.type, res);
    }

    if (res.type === 'line') {
      setGuideLine(chart, res);
    } else if (res.type === 'region') {
      chart.guide().region(res);
    } else if (res.type === 'arc') {
      setGuideArc(chart, res);
    } else if (res.type === 'text') {
      chart.guide().text(res);
    } else if (res.type === 'image') {
      chart.guide().image(res);
    } else if (res.type === 'html') {
      chart.guide().html(res);
    } else if (res.type === 'dataMarker') {
      chart.guide().dataMarker(res);
    } else if (res.type === 'regionFilter') {
      chart.guide().regionFilter(res);
    } else if (res.type === 'dataRegion') {
      chart.guide().dataRegion(res);
    }
  });
  return chart;
};

exports.process = process;