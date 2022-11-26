"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Global = exports.registerShape = exports.registerAnimation = exports.default = void 0;

var viser = _interopRequireWildcard(require("viser"));

var _typed = _interopRequireDefault(require("./typed"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var regSeries = ['pie', 'sector', 'line', 'smoothline', 'dashline', 'area', 'point', 'stackarea', 'stackline', 'smootharea', 'bar', 'stackbar', 'dodgebar', 'interval', 'stackinterval', 'dodgeinterval', 'funnel', 'pyramid', 'schema', 'box', 'candle', 'polygon', 'contour', 'heatmap', 'edge', 'sankey', 'errorbar', 'jitterpoint', 'path', 'venn'];
var rootCharts = ['v-chart', 'v-lite-chart'];
var rootPlugin = ['v-plugin'];
var rootChartProps = ['data', 'scale', 'filter', 'viewId'];
var seriesProps = ['position', 'quickType', 'gemo', 'adjust', 'color', 'shape', 'size', 'opacity', 'label', 'tooltip', 'style', 'animate'];

var camelCase = function () {
  var DEFAULT_REGEX = /[-_]+(.)?/g;

  function toUpper(match, group1) {
    return group1 ? group1.toUpperCase() : '';
  }

  return function (str, delimiters) {
    return str.replace(delimiters ? new RegExp('[' + delimiters + ']+(.)?', 'g') : DEFAULT_REGEX, toUpper);
  };
}();

var baseChartComponent = {
  data: function data() {
    return {
      isViser: true,
      jsonForD2: {}
    };
  },
  props: _typed.default,
  methods: {
    checkIsContainer: function checkIsContainer(componentInstance) {
      if (componentInstance.isViser && rootCharts.concat(['v-view', 'v-facet', 'v-facet-view', 'v-plugin']).indexOf(componentInstance.$options._componentTag) > -1) {
        return true;
      } else {
        return false;
      }
    },
    findNearestRootComponent: function findNearestRootComponent(componentInstance) {
      if (this.checkIsContainer(componentInstance)) {
        if (componentInstance.$options._componentTag === 'v-lite-chart') {
          throw Error('v-lite-chart should be no child elements.');
        }

        return componentInstance;
      }

      if (componentInstance.$parent) {
        return this.findNearestRootComponent(componentInstance.$parent);
      }

      return null;
    },
    createRootD2Json: function createRootD2Json() {
      if (this.$options._componentTag === 'v-plugin') {
        return __assign({}, cleanUndefined(normalizeProps(this._props, rootChartProps)), this.jsonForD2);
      }

      var d2Json = __assign({}, cleanUndefined(normalizeProps(this._props, rootChartProps)), {
        chart: __assign({
          container: this.$el
        }, cleanUndefined(normalizeProps(this._props, null, rootChartProps)))
      }, this.jsonForD2);

      if (this.$options._componentTag === 'v-lite-chart') {
        var existProps_1 = cleanUndefined(this._props);
        Object.keys(existProps_1).forEach(function (propsKey) {
          var lowerCasePropsKey = propsKey.toLowerCase();

          if (regSeries.indexOf(lowerCasePropsKey) > -1) {
            safePush(d2Json, 'series', __assign({
              quickType: propsKey
            }, normalizeProps(existProps_1, seriesProps)));
          }
        });
        setIfNotExist(d2Json, 'axis', true);
        setIfNotExist(d2Json, 'legend', true);
        setIfNotExist(d2Json, 'tooltip', true);
      }

      return d2Json;
    },
    freshChart: function freshChart(isUpdate) {
      if (rootPlugin.indexOf(this.$options._componentTag) > -1) {
        var d2Json = this.createRootD2Json();
        this.plugins = viser.Plugin(d2Json);
      } else if (rootCharts.indexOf(this.$options._componentTag) > -1) {
        var d2Json = this.createRootD2Json();

        if (!isUpdate || !this.chart) {
          this.chart = viser["default"](d2Json);
        } else {
          this.chart.repaint(d2Json);
        }
      } else if (this.$options._componentTag === 'v-view') {
        var nearestRootComponent = this.findNearestRootComponent(this.$parent);
        oneObjectMoreArray(nearestRootComponent.jsonForD2, 'views', __assign({}, cleanUndefined(normalizeProps(this._props)), this.jsonForD2, {
          viewId: this._uid
        }));
      } else if (this.$options._componentTag === 'v-facet-view') {
        var nearestRootComponent = this.findNearestRootComponent(this.$parent);
        nearestRootComponent.jsonForD2.views = __assign({}, cleanUndefined(normalizeProps(this._props)), this.jsonForD2);
      } else if (this.$options._componentTag === 'v-facet') {
        var nearestRootComponent = this.findNearestRootComponent(this.$parent);
        nearestRootComponent.jsonForD2.facet = __assign({}, cleanUndefined(normalizeProps(this._props)), this.jsonForD2);
      } else if (this.$options._componentTag === 'v-slider') {
        var nearestRootComponent = this.findNearestRootComponent(this.$parent);
        var sliderOpts = cleanUndefined(normalizeProps(this._props));

        if (!cleanUndefined(normalizeProps(this._props)).container) {
          sliderOpts.container = 'viser-slider-' + generateRandomNum();
        }

        var sliderContainer = document.createElement('div');
        sliderContainer.id = sliderOpts.container;
        this.$parent.$el.appendChild(sliderContainer);
        nearestRootComponent.jsonForD2.slider = __assign({}, sliderOpts, this.jsonForD2);
      } else {
        var nearestRootComponent = this.findNearestRootComponent(this.$parent);

        if (!nearestRootComponent) {
          throw Error(this.$options._componentTag + " must be wrapped into v-chart or v-plugin");
        }

        var rechartName = this.$options._componentTag.replace(/-/g, '').slice(1);

        var rechartNameCamelCase = camelCase(this.$options._componentTag.slice(2));

        if (isAllUndefined(this._props)) {
          nearestRootComponent.jsonForD2[rechartName] = true;
        } else if (regSeries.indexOf(rechartName) > -1) {
          safePush(nearestRootComponent.jsonForD2, 'series', __assign({
            quickType: rechartNameCamelCase
          }, cleanUndefined(normalizeProps(this._props))));
        } else {
          oneObjectMoreArray(nearestRootComponent.jsonForD2, rechartName, __assign({}, cleanUndefined(normalizeProps(this._props)), {
            componentId: this._uid
          }));
        }
      }
    }
  },
  created: function created() {},
  mounted: function mounted() {
    this.freshChart(false);
  },
  updated: function updated() {
    this.freshChart(true);
  },
  render: function render(createElement) {
    var isContainer = this.checkIsContainer(this);

    if (isContainer) {
      return createElement('div', null, this.$slots["default"]);
    }

    var props = cleanUndefined(normalizeProps(this._props));
    return createElement('div', {
      style: {
        display: 'none'
      }
    }, Object.keys(props).map(function (key) {
      return '' + key + ':' + JSON.stringify(props[key]);
    }));
  }
};
var installMaps = {
  'v-chart': baseChartComponent,
  'v-tooltip': baseChartComponent,
  'v-legend': baseChartComponent,
  'v-axis': baseChartComponent,
  'v-brush': baseChartComponent,
  'v-view': baseChartComponent,
  'v-coord': baseChartComponent,
  'v-series': baseChartComponent,
  'v-facet': baseChartComponent,
  'v-facet-view': baseChartComponent,
  'v-lite-chart': baseChartComponent,
  'v-guide': baseChartComponent,
  'v-edge': baseChartComponent,
  'v-point': baseChartComponent,
  'v-pie': baseChartComponent,
  'v-bar': baseChartComponent,
  'v-stack-bar': baseChartComponent,
  'v-dodge-bar': baseChartComponent,
  'v-interval': baseChartComponent,
  'v-stack-interval': baseChartComponent,
  'v-dodge-interval': baseChartComponent,
  'v-schema': baseChartComponent,
  'v-line': baseChartComponent,
  'v-smooth-line': baseChartComponent,
  'v-dash-line': baseChartComponent,
  'v-sector': baseChartComponent,
  'v-area': baseChartComponent,
  'v-stack-area': baseChartComponent,
  'v-stack-line': baseChartComponent,
  'v-smooth-area': baseChartComponent,
  'v-funnel': baseChartComponent,
  'v-pyramid': baseChartComponent,
  'v-box': baseChartComponent,
  'v-candle': baseChartComponent,
  'v-polygon': baseChartComponent,
  'v-contour': baseChartComponent,
  'v-heatmap': baseChartComponent,
  'v-sankey': baseChartComponent,
  'v-error-bar': baseChartComponent,
  'v-jitter-point': baseChartComponent,
  'v-path': baseChartComponent,
  'v-venn': baseChartComponent,
  'v-plugin': baseChartComponent,
  'v-slider': baseChartComponent
};
var _default = {
  install: function install(Vue, options) {
    if (!options) {
      options = Object.keys(installMaps);
    }

    options.forEach(function (key) {
      Vue.component(key, __assign({}, installMaps[key], {
        name: key
      }));
    });
  }
};
exports.default = _default;

function safePush(obj, key, value) {
  if (!obj[key]) {
    obj[key] = [];
  }

  cleanUndefined(value);
  obj[key].push(value);
}

function oneObjectMoreArray(obj, key, value) {
  if (!obj[key]) {
    obj[key] = value;
    return;
  }

  if (obj[key] && obj[key].constructor.name === 'Object') {
    obj[key] = [obj[key]];
  }

  var indexOfSameObject = -1;

  if (value && value.viewId) {
    obj[key].forEach(function (o, i) {
      if (o && o.viewId && o.viewId === value.viewId) {
        indexOfSameObject = i;
      }
    });
  } else if (value && value.componentId) {
    obj[key].forEach(function (o, i) {
      if (o && o.componentId && o.componentId === value.componentId) {
        indexOfSameObject = i;
      }
    });
  }

  if (indexOfSameObject === -1) {
    obj[key].push(value);
  } else {
    obj[key][indexOfSameObject] = __assign({}, obj[key][indexOfSameObject], value);
  }
}

function cleanUndefined(value) {
  var newValue = __assign({}, value);

  for (var key in newValue) {
    if (newValue[key] === undefined) {
      delete newValue[key];
    }
  }

  return newValue;
}

function isAllUndefined(value) {
  return Object.keys(value).every(function (key) {
    return value[key] === undefined;
  });
}

function normalizeProps(props, include, expect) {
  if (include === void 0) {
    include = null;
  }

  if (expect === void 0) {
    expect = null;
  }

  var newProps = __assign({}, props);

  if (newProps.vStyle) {
    newProps.style = newProps.vStyle;
    delete newProps.vStyle;
  }

  if (expect !== null) {
    expect.forEach(function (propsKey) {
      delete newProps[propsKey];
    });
  }

  if (include !== null) {
    Object.keys(newProps).forEach(function (propsKey) {
      if (include.indexOf(propsKey) === -1) {
        delete newProps[propsKey];
      }
    });
  }

  return newProps;
}

function setIfNotExist(obj, key, value) {
  if (!obj[key]) {
    obj[key] = value;
  }
}

function generateRandomNum() {
  return Math.floor(new Date().getTime() + Math.random() * 10000).toString();
}

var registerAnimation = viser.registerAnimation;
exports.registerAnimation = registerAnimation;
var registerShape = viser.registerShape;
exports.registerShape = registerShape;
var Global = viser.Global;
exports.Global = Global;