"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get2 = _interopRequireDefault(require("lodash/get"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var setAxisConfig = _interopRequireWildcard(require("../components/setAxisConfig"));

var setCoordConfig = _interopRequireWildcard(require("../components/setCoordConfig"));

var setFilterConfig = _interopRequireWildcard(require("../components/setFilterConfig"));

var setGuideConfig = _interopRequireWildcard(require("../components/setGuideConfig"));

var setLegendConfig = _interopRequireWildcard(require("../components/setLegendConfig"));

var setScaleConfig = _interopRequireWildcard(require("../components/setScaleConfig"));

var setSeriesConfig = _interopRequireWildcard(require("../components/setSeriesConfig"));

var setTooltipConfig = _interopRequireWildcard(require("../components/setTooltipConfig"));

var _loadShapes = _interopRequireDefault(require("../shapes/loadShapes"));

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

var G2 = require('@antv/g2');

var Brush = require('@antv/g2-brush');

function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, function (L) {
    return L.toUpperCase();
  });
}

var CommonChart = function () {
  function CommonChart(config) {
    this.viewInstance = {};
    this.config = (0, _cloneDeep2.default)(config);
    this.checkChartConfig(this.config);
    this.chartInstance = new G2.Chart(this.config.chart);
  }

  CommonChart.prototype.getWidth = function () {
    return this.chartInstance.get('width');
  };

  CommonChart.prototype.getHeight = function () {
    return this.chartInstance.get('height');
  };

  CommonChart.prototype.render = function () {
    var config = this.config;
    var chart = this.chartInstance;
    (0, _loadShapes.default)();
    this.setEvents(chart, config);
    this.setDataSource(chart, config.data);
    this.setCoord(chart, config);
    this.setTooltip(chart, config);
    this.setAxis(chart, config);
    this.setContent(chart, config);
    this.setLegend(chart, config);
    this.setViews(chart, config);
    this.setFacet(chart, config);
    chart.render();
    this.setDefaultTooltip(chart, config);
    this.setBrush(chart, config);
  };

  CommonChart.prototype.repaint = function (config) {
    var newConfig = (0, _cloneDeep2.default)(config);
    this.checkChartConfig(newConfig);
    this.renderDiffConfig(newConfig);
  };

  CommonChart.prototype.destroy = function (chart) {
    if (chart) {
      chart.destroy();
    }
  };

  CommonChart.prototype.clear = function (chart) {
    if (chart) {
      chart.clear();
    }
  };

  CommonChart.prototype.checkChartConfig = function (config) {
    var chart = config.chart;

    if (!chart || !chart.height) {
      throw new Error('please set correct chart option');
    }
  };

  CommonChart.prototype.createView = function (chart, config) {
    var opts = {};

    if (config.start) {
      opts.start = config.start;
    }

    if (config.end) {
      opts.end = config.end;
    }

    var view = chart.view(opts);

    if (!config.viewId) {
      throw new Error('you must set viewId');
    }

    this.viewInstance[config.viewId] = view;
    return view;
  };

  CommonChart.prototype.setEvents = function (chart, config) {
    EventUtils.setEvent(chart, '', config.chart);
  };

  CommonChart.prototype.setDataSource = function (chart, data) {
    if (!(0, _isNil2.default)(data) && !(0, _isEmpty2.default)(data)) {
      chart.source(data);
    }
  };

  CommonChart.prototype.setFilter = function (chart, config) {
    return setFilterConfig.process(chart, config);
  };

  CommonChart.prototype.setScale = function (chart, config) {
    return setScaleConfig.process(chart, config);
  };

  CommonChart.prototype.setCoord = function (chart, config) {
    return setCoordConfig.process(chart, config);
  };

  CommonChart.prototype.setSeries = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    return setSeriesConfig.process(chart, config, isUpdate);
  };

  CommonChart.prototype.setAxis = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    return setAxisConfig.process(chart, config, isUpdate);
  };

  CommonChart.prototype.setTooltip = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    return setTooltipConfig.process(chart, config, isUpdate);
  };

  CommonChart.prototype.setDefaultTooltip = function (chart, config) {
    return setTooltipConfig.setDefaultPoint(chart, config);
  };

  CommonChart.prototype.setGuide = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    return setGuideConfig.process(chart, config, isUpdate);
  };

  CommonChart.prototype.setLegend = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    return setLegendConfig.process(chart, config, isUpdate);
  };

  CommonChart.prototype.setContent = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    this.setScale(chart, config);
    this.setFilter(chart, config);
    this.setSeries(chart, config, isUpdate);
    this.setGuide(chart, config, isUpdate);
  };

  CommonChart.prototype.setView = function (item, chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    var view = this.createView(chart, item);
    var viewData = item.data ? item.data : config.data;
    this.setDataSource(view, viewData);

    if (!(0, _isNil2.default)(item.coord)) {
      this.setCoord(view, item);
    }

    if (!(0, _isNil2.default)(item.tooltip)) {
      this.setTooltip(view, item, isUpdate);
    }

    if (!(0, _isNil2.default)(item.axis)) {
      this.setAxis(view, item, isUpdate);
    }

    if (!(0, _isNil2.default)(item.guide)) {
      this.setGuide(view, item, isUpdate);
    }

    this.setContent(view, item, isUpdate);
    return view;
  };

  CommonChart.prototype.setViews = function (chart, config, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    var cViews = (0, _cloneDeep2.default)(config.views);
    var isArr = Array.isArray(cViews);

    if ((0, _isNil2.default)(cViews) || (0, _isEmpty2.default)(cViews)) {
      return;
    }

    var arrViews = isArr ? cViews : [cViews];

    for (var _i = 0, arrViews_1 = arrViews; _i < arrViews_1.length; _i++) {
      var item = arrViews_1[_i];
      this.setView(item, chart, config, isUpdate);
    }
  };

  CommonChart.prototype.setFacetViews = function (chart, facet, views, isUpdate) {
    if (isUpdate === void 0) {
      isUpdate = false;
    }

    this.setDataSource(chart, views.data);

    if (!(0, _isNil2.default)(views.coord)) {
      this.setCoord(chart, views);
    }

    if (!(0, _isNil2.default)(views.tooltip)) {
      this.setTooltip(chart, views, isUpdate);
    }

    if (!(0, _isNil2.default)(views.axis)) {
      this.setAxis(chart, views, isUpdate);
    }

    if (!(0, _isNil2.default)(views.guide)) {
      this.setGuide(chart, views, isUpdate);
    }

    this.setContent(chart, views);
  };

  CommonChart.prototype.setFacet = function (chart, config, isUpdate) {
    var _this = this;

    if (isUpdate === void 0) {
      isUpdate = false;
    }

    var cFacet = (0, _cloneDeep2.default)(config.facet);

    if ((0, _isNil2.default)(cFacet) || (0, _isEmpty2.default)(cFacet)) {
      return;
    }

    var options = (0, _omit2.default)(cFacet, ['type', 'views']);

    if ((0, _isEmpty2.default)(cFacet.views) && !(0, _isFunction2.default)(cFacet.views)) {
      return chart.facet(cFacet.type, options);
    }

    if ((0, _isFunction2.default)(cFacet.views)) {
      options.eachView = function (v, f) {
        _this.setFacetViews(v, f, cFacet.views(v, f), isUpdate);
      };
    } else {
      cFacet.views = Array.isArray(cFacet.views) ? cFacet.views : [cFacet.views];

      options.eachView = function (v, f) {
        _this.setFacetViews(v, f, cFacet.views[0], isUpdate);
      };
    }

    return chart.facet(cFacet.type, options);
  };

  CommonChart.prototype.setBrush = function (chart, config) {
    if ((0, _isNil2.default)(config.brush) || (0, _isEmpty2.default)(config.brush)) {
      return;
    }

    var brush = config.brush;

    var brushConfig = __assign({}, config.brush, {
      canvas: chart.get('canvas'),
      chart: chart
    });

    var regEvents = /on(BrushStart|BrushMove|BrushEnd|DragStart|DragMove|DragEnd)/;
    var events = Object.keys(brush).filter(function (entry) {
      return regEvents.test(entry);
    });
    events.forEach(function (entry) {
      var item = regEvents.exec(entry);

      if (item && item.length) {
        var oriEventName = 'on' + firstUpperCase(item[0]);

        brushConfig[oriEventName] = function (ev) {
          brush[entry](ev, chart);
        };
      }
    });
    new Brush(brushConfig);
  };

  CommonChart.prototype.repaintWidthHeight = function (chart, config) {
    var width = (0, _get2.default)(config, 'chart.width');

    if (width) {
      chart.changeWidth(width);
    }

    var height = (0, _get2.default)(config, 'chart.height');

    if (height) {
      chart.changeHeight(height);
    }
  };

  CommonChart.prototype.renderDiffConfig = function (config) {
    var chart = this.chartInstance;
    this.clear(chart);
    this.setScale(chart, config);
    this.setCoord(chart, config);
    this.setFilter(chart, config);
    this.setAxis(chart, config, true);
    this.setSeries(chart, config, true);
    this.setTooltip(chart, config, true);
    this.setGuide(chart, config, true);
    this.setViews(chart, config, true);
    this.setLegend(chart, config, true);
    this.setFacet(chart, config, true);
    this.repaintWidthHeight(chart, config);

    if (config.data) {
      chart.changeData(config.data);
    }

    chart.repaint();
    this.setBrush(chart, config);
  };

  return CommonChart;
}();

var _default = CommonChart;
exports.default = _default;