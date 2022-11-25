"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var EventUtils = _interopRequireWildcard(require("../utils/EventUtils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setHighlight(item) {
  item.onHover = function (ev) {
    var shapes = ev.shapes;
    var geom = ev.geom;
    geom.highlightShapes(shapes);
  };

  return item;
}

var process = function process(chart, config, isUpdate) {
  if (isUpdate === void 0) {
    isUpdate = false;
  }

  var cLegend = (0, _cloneDeep2.default)(config.legend);
  var isArr = Array.isArray(cLegend);

  if ((0, _isNil2.default)(cLegend) || cLegend === false || isArr && cLegend.length === 0) {
    return chart.legend(false);
  }

  if (cLegend === true) {
    return chart.legend();
  }

  var arrLegend = isArr ? cLegend : [cLegend];

  for (var _i = 0, arrLegend_1 = arrLegend; _i < arrLegend_1.length; _i++) {
    var res = arrLegend_1[_i];

    if (res.highlight) {
      res = setHighlight(res);
    }

    var _loop_1 = function _loop_1(item) {
      if (res.hasOwnProperty(item)) {
        if (item === 'onClick') {
          var content_1 = res.onClick;

          res.onClick = function (ev) {
            content_1(ev, chart);
          };
        }

        if (!isUpdate) {
          EventUtils.setSEvent(chart, 'legend', item, res[item]);
        }
      }
    };

    for (var item in res) {
      _loop_1(item);
    }

    if (!(0, _isNil2.default)(res.legendMarker)) {
      res['g2-legend-marker'] = res.legendMarker;
    }

    if (!(0, _isNil2.default)(res.legendListItem)) {
      res['g2-legend-list-item'] = res.legendListItem;
    }

    if (!(0, _isNil2.default)(res.legendTitle)) {
      res['g2-legend-title'] = res.legendTitle;
    }

    if (!(0, _isNil2.default)(res.legendList)) {
      res['g2-legend-list'] = res.legendList;
    }

    res = (0, _omit2.default)(res, ['legendMarker', 'legendListItem', 'legendTitle', 'legendList']);

    if (res.dataKey) {
      if (res.show === false) {
        chart.legend(res.dataKey, false);
      } else {
        var option = (0, _omit2.default)(res, ['dataKey', 'show']);
        chart.legend(res.dataKey, option);
      }
    } else {
      chart.legend(res);
    }
  }

  return chart;
};

exports.process = process;