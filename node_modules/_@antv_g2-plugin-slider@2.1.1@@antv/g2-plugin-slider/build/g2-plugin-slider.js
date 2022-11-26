(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Slider"] = factory();
	else
		root["Slider"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Slider = __webpack_require__(1);

if (window && !window.G2) {
  console.err('Please load the G2 script first!');
}

module.exports = Slider;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileOverview G2's plugin for datazoom.
 * @author sima.zhang
 */
var Range = __webpack_require__(2);

var G2 = window && window.G2;
var Chart = G2.Chart,
    Util = G2.Util,
    G = G2.G,
    Global = G2.Global;
var Canvas = G.Canvas;
var DomUtil = Util.DomUtil;

var isNumber = function isNumber(val) {
  return typeof val === 'number';
};

var Slider =
/*#__PURE__*/
function () {
  var _proto = Slider.prototype;

  _proto._initProps = function _initProps() {
    this.height = 26;
    this.width = 'auto'; // 默认自适应

    this.padding = Global.plotCfg.padding;
    this.container = null;
    this.xAxis = null;
    this.yAxis = null; // 选中区域的样式

    this.fillerStyle = {
      fill: '#BDCCED',
      fillOpacity: 0.3
    }; // 滑动条背景样式

    this.backgroundStyle = {
      stroke: '#CCD6EC',
      fill: '#CCD6EC',
      fillOpacity: 0.3,
      lineWidth: 1
    };
    this.range = [0, 100];
    this.layout = 'horizontal'; // 文本颜色

    this.textStyle = {
      fill: '#545454'
    }; // 滑块的样式

    this.handleStyle = {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/QXtfhORGlDuRvLXFzpsQ.png',
      width: 5
    }; // 背景图表的配置，如果为 false 则表示不渲染

    this.backgroundChart = {
      type: ['area'],
      // 图表的类型，可以是字符串也可是是数组
      color: '#CCD6EC'
    };
  };

  function Slider(cfg) {
    this._initProps();

    Util.deepMix(this, cfg);
    var container = this.container;

    if (!container) {
      throw new Error('Please specify the container for the Slider!');
    }

    if (Util.isString(container)) {
      this.domContainer = document.getElementById(container);
    } else {
      this.domContainer = container;
    }

    this.handleStyle = Util.mix({
      width: this.height,
      height: this.height
    }, this.handleStyle);

    if (this.width === 'auto') {
      // 宽度自适应
      window.addEventListener('resize', Util.wrapBehavior(this, '_initForceFitEvent'));
    }
  }

  _proto._initForceFitEvent = function _initForceFitEvent() {
    var timer = setTimeout(Util.wrapBehavior(this, 'forceFit'), 200);
    clearTimeout(this.resizeTimer);
    this.resizeTimer = timer;
  };

  _proto.forceFit = function forceFit() {
    if (!this || this.destroyed) {
      return;
    }

    var width = DomUtil.getWidth(this.domContainer);
    var height = this.height;

    if (width !== this.domWidth) {
      var canvas = this.canvas;
      canvas.changeSize(width, height); // 改变画布尺寸

      this.bgChart && this.bgChart.changeWidth(width);
      canvas.clear();

      this._initWidth();

      this._initSlider(); // 初始化滑动条


      this._bindEvent();

      canvas.draw();
    }
  };

  _proto._initWidth = function _initWidth() {
    var width;

    if (this.width === 'auto') {
      width = DomUtil.getWidth(this.domContainer);
    } else {
      width = this.width;
    }

    this.domWidth = width;
    var padding = Util.toAllPadding(this.padding);

    if (this.layout === 'horizontal') {
      this.plotWidth = width - padding[1] - padding[3];
      this.plotPadding = padding[3];
      this.plotHeight = this.height;
    } else if (this.layout === 'vertical') {
      this.plotWidth = this.width;
      this.plotHeight = this.height - padding[0] - padding[2];
      this.plotPadding = padding[0];
    }
  };

  _proto.render = function render() {
    this._initWidth();

    this._initCanvas(); // 初始化 canvas


    this._initBackground(); // 初始化背景图表


    this._initSlider(); // 初始化滑动条


    this._bindEvent();

    this.canvas.draw();
  };

  _proto.changeData = function changeData(data) {
    this.data = data;
    this.repaint();
  };

  _proto.destroy = function destroy() {
    clearTimeout(this.resizeTimer);
    var rangeElement = this.rangeElement;
    rangeElement.off('sliderchange');
    this.bgChart && this.bgChart.destroy();
    this.canvas.destroy();
    var container = this.domContainer;

    while (container.hasChildNodes()) {
      container.removeChild(container.firstChild);
    }

    window.removeEventListener('resize', Util.getWrapBehavior(this, '_initForceFitEvent'));
    this.destroyed = true;
  };

  _proto.clear = function clear() {
    this.canvas.clear();
    this.bgChart && this.bgChart.destroy();
    this.bgChart = null;
    this.scale = null;
    this.canvas.draw();
  };

  _proto.repaint = function repaint() {
    this.clear();
    this.render();
  };

  _proto._initCanvas = function _initCanvas() {
    var width = this.domWidth;
    var height = this.height;
    var canvas = new Canvas({
      width: width,
      height: height,
      containerDOM: this.domContainer,
      capture: false
    });
    var node = canvas.get('el');
    node.style.position = 'absolute';
    node.style.top = 0;
    node.style.left = 0;
    node.style.zIndex = 3;
    this.canvas = canvas;
  };

  _proto._initBackground = function _initBackground() {
    var _Util$deepMix;

    var data = this.data;
    var xAxis = this.xAxis;
    var yAxis = this.yAxis;
    var scales = Util.deepMix((_Util$deepMix = {}, _Util$deepMix["" + xAxis] = {
      range: [0, 1]
    }, _Util$deepMix), this.scales); // 用户列定义

    if (!data) {
      // 没有数据，则不创建
      throw new Error('Please specify the data!');
    }

    if (!xAxis) {
      throw new Error('Please specify the xAxis!');
    }

    if (!yAxis) {
      throw new Error('Please specify the yAxis!');
    }

    var backgroundChart = this.backgroundChart;
    var type = backgroundChart.type;
    var color = backgroundChart.color;

    if (!Util.isArray(type)) {
      type = [type];
    }

    var padding = Util.toAllPadding(this.padding);
    var bgChart = new Chart({
      container: this.container,
      width: this.domWidth,
      height: this.height,
      padding: [0, padding[1], 0, padding[3]],
      animate: false
    });
    bgChart.source(data);
    bgChart.scale(scales);
    bgChart.axis(false);
    bgChart.tooltip(false);
    bgChart.legend(false);
    Util.each(type, function (eachType) {
      bgChart[eachType]().position(xAxis + '*' + yAxis).color(color).opacity(1);
    });
    bgChart.render();
    this.bgChart = bgChart;
    this.scale = this.layout === 'horizontal' ? bgChart.getXScale() : bgChart.getYScales()[0];

    if (this.layout === 'vertical') {
      bgChart.destroy();
    }
  };

  _proto._initRange = function _initRange() {
    var startRadio = this.startRadio;
    var endRadio = this.endRadio;
    var start = this.start;
    var end = this.end;
    var scale = this.scale;
    var min = 0;
    var max = 1; // startRadio 优先级高于 start

    if (isNumber(startRadio)) {
      min = startRadio;
    } else if (start) {
      min = scale.scale(scale.translate(start));
    } // endRadio 优先级高于 end


    if (isNumber(endRadio)) {
      max = endRadio;
    } else if (end) {
      max = scale.scale(scale.translate(end));
    }

    var minSpan = this.minSpan,
        maxSpan = this.maxSpan;
    var totalSpan = 0;

    if (scale.type === 'time' || scale.type === 'timeCat') {
      // 时间类型已排序
      var values = scale.values;
      var firstValue = values[0];
      var lastValue = values[values.length - 1];
      totalSpan = lastValue - firstValue;
    } else if (scale.isLinear) {
      totalSpan = scale.max - scale.min;
    }

    if (totalSpan && minSpan) {
      this.minRange = minSpan / totalSpan * 100;
    }

    if (totalSpan && maxSpan) {
      this.maxRange = maxSpan / totalSpan * 100;
    }

    var range = [min * 100, max * 100];
    this.range = range;
    return range;
  };

  _proto._getHandleValue = function _getHandleValue(type) {
    var value;
    var range = this.range;
    var min = range[0] / 100;
    var max = range[1] / 100;
    var scale = this.scale;

    if (type === 'min') {
      value = this.start ? this.start : scale.invert(min);
    } else {
      value = this.end ? this.end : scale.invert(max);
    }

    return value;
  };

  _proto._initSlider = function _initSlider() {
    var canvas = this.canvas;

    var range = this._initRange();

    var scale = this.scale;
    var rangeElement = canvas.addGroup(Range, {
      middleAttr: this.fillerStyle,
      range: range,
      minRange: this.minRange,
      maxRange: this.maxRange,
      layout: this.layout,
      width: this.plotWidth,
      height: this.plotHeight,
      backgroundStyle: this.backgroundStyle,
      textStyle: this.textStyle,
      handleStyle: this.handleStyle,
      minText: scale.getText(this._getHandleValue('min')),
      maxText: scale.getText(this._getHandleValue('max'))
    });

    if (this.layout === 'horizontal') {
      rangeElement.translate(this.plotPadding, 0);
    } else if (this.layout === 'vertical') {
      rangeElement.translate(0, this.plotPadding);
    }

    this.rangeElement = rangeElement;
  };

  _proto._bindEvent = function _bindEvent() {
    var self = this;
    var rangeElement = self.rangeElement;
    rangeElement.on('sliderchange', function (ev) {
      var range = ev.range;
      var minRatio = range[0] / 100;
      var maxRatio = range[1] / 100;

      self._updateElement(minRatio, maxRatio);
    });
  };

  _proto._updateElement = function _updateElement(minRatio, maxRatio) {
    var scale = this.scale;
    var rangeElement = this.rangeElement;
    var minTextElement = rangeElement.get('minTextElement');
    var maxTextElement = rangeElement.get('maxTextElement');
    var min = scale.invert(minRatio);
    var max = scale.invert(maxRatio);
    var minText = scale.getText(min);
    var maxText = scale.getText(max);
    minTextElement.attr('text', minText);
    maxTextElement.attr('text', maxText);
    this.start = min;
    this.end = max;

    if (this.onChange) {
      this.onChange({
        startText: minText,
        endText: maxText,
        startValue: min,
        endValue: max,
        startRadio: minRatio,
        endRadio: maxRatio
      });
    }
  };

  return Slider;
}();

module.exports = Slider;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview The class of slider
 * @author sima.zhang
 */
var G2 = window && window.G2;
var Util = G2.Util,
    G = G2.G;
var Group = G.Group;
var DomUtil = Util.DomUtil;
var OFFSET = 5;

var Range =
/*#__PURE__*/
function (_Group) {
  _inheritsLoose(Range, _Group);

  function Range() {
    return _Group.apply(this, arguments) || this;
  }

  var _proto = Range.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * 范围
       * @type {Array}
       */
      range: null,

      /**
       * 中滑块属性
       * @type {ATTRS}
       */
      middleAttr: null,

      /**
       * 背景
       * @type {G-Element}
       */
      backgroundElement: null,

      /**
       * 下滑块
       * @type {G-Element}
       */
      minHandleElement: null,

      /**
       * 上滑块
       * @type {G-Element}
       */
      maxHandleElement: null,

      /**
       * 中块
       * @type {G-Element}
       */
      middleHandleElement: null,

      /**
       * 当前的激活的元素
       * @type {G-Element}
       */
      currentTarget: null,

      /**
       * 布局方式： horizontal，vertical
       * @type {String}
       */
      layout: 'vertical',

      /**
       * 宽
       * @type {Number}
       */
      width: null,

      /**
       * 高
       * @type {Number}
       */
      height: null,

      /**
       * 当前的PageX
       * @type {Number}
       */
      pageX: null,

      /**
       * 当前的PageY
       * @type {Number}
       */
      pageY: null
    };
  };

  _proto._initHandle = function _initHandle(type) {
    var handle = this.addGroup();
    var layout = this.get('layout');
    var handleStyle = this.get('handleStyle');
    var img = handleStyle.img;
    var iconWidth = handleStyle.width;
    var iconHeight = handleStyle.height;
    var text;
    var handleIcon;
    var triggerCursor;

    if (layout === 'horizontal') {
      var _iconWidth = handleStyle.width;
      triggerCursor = 'ew-resize';
      handleIcon = handle.addShape('Image', {
        attrs: {
          x: -_iconWidth / 2,
          y: 0,
          width: _iconWidth,
          height: iconHeight,
          img: img,
          cursor: triggerCursor
        }
      });
      text = handle.addShape('Text', {
        attrs: Util.mix({
          x: type === 'min' ? -(_iconWidth / 2 + OFFSET) : _iconWidth / 2 + OFFSET,
          y: iconHeight / 2,
          textAlign: type === 'min' ? 'end' : 'start',
          textBaseline: 'middle',
          text: type === 'min' ? this.get('minText') : this.get('maxText'),
          cursor: triggerCursor
        }, this.get('textStyle'))
      });
    } else {
      triggerCursor = 'ns-resize';
      handleIcon = handle.addShape('Image', {
        attrs: {
          x: 0,
          y: -iconHeight / 2,
          width: iconWidth,
          height: iconHeight,
          img: img,
          cursor: triggerCursor
        }
      });
      text = handle.addShape('Text', {
        attrs: Util.mix({
          x: iconWidth / 2,
          y: type === 'min' ? iconHeight / 2 + OFFSET : -(iconHeight / 2 + OFFSET),
          textAlign: 'center',
          textBaseline: 'middle',
          text: type === 'min' ? this.get('minText') : this.get('maxText'),
          cursor: triggerCursor
        }, this.get('textStyle'))
      });
    }

    this.set(type + 'TextElement', text);
    this.set(type + 'IconElement', handleIcon);
    return handle;
  };

  _proto._initSliderBackground = function _initSliderBackground() {
    var backgroundElement = this.addGroup();
    backgroundElement.initTransform();
    backgroundElement.translate(0, 0);
    backgroundElement.addShape('Rect', {
      attrs: Util.mix({
        x: 0,
        y: 0,
        width: this.get('width'),
        height: this.get('height')
      }, this.get('backgroundStyle'))
    });
    return backgroundElement;
  };

  _proto._beforeRenderUI = function _beforeRenderUI() {
    var backgroundElement = this._initSliderBackground();

    var minHandleElement = this._initHandle('min');

    var maxHandleElement = this._initHandle('max');

    var middleHandleElement = this.addShape('rect', {
      attrs: this.get('middleAttr')
    });
    this.set('middleHandleElement', middleHandleElement);
    this.set('minHandleElement', minHandleElement);
    this.set('maxHandleElement', maxHandleElement);
    this.set('backgroundElement', backgroundElement);
    backgroundElement.set('zIndex', 0);
    middleHandleElement.set('zIndex', 1);
    minHandleElement.set('zIndex', 2);
    maxHandleElement.set('zIndex', 2);
    middleHandleElement.attr('cursor', 'move');
    this.sort();
  };

  _proto._renderUI = function _renderUI() {
    if (this.get('layout') === 'horizontal') {
      this._renderHorizontal();
    } else {
      this._renderVertical();
    }
  };

  _proto._transform = function _transform(layout) {
    var range = this.get('range');
    var minRatio = range[0] / 100;
    var maxRatio = range[1] / 100;
    var width = this.get('width');
    var height = this.get('height');
    var minHandleElement = this.get('minHandleElement');
    var maxHandleElement = this.get('maxHandleElement');
    var middleHandleElement = this.get('middleHandleElement');

    if (minHandleElement.resetMatrix) {
      minHandleElement.resetMatrix();
      maxHandleElement.resetMatrix();
    } else {
      minHandleElement.initTransform();
      maxHandleElement.initTransform();
    }

    if (layout === 'horizontal') {
      middleHandleElement.attr({
        x: width * minRatio,
        y: 0,
        width: (maxRatio - minRatio) * width,
        height: height
      });
      minHandleElement.translate(minRatio * width, 0);
      maxHandleElement.translate(maxRatio * width, 0);
    } else {
      middleHandleElement.attr({
        x: 0,
        y: height * (1 - maxRatio),
        width: width,
        height: (maxRatio - minRatio) * height
      });
      minHandleElement.translate(0, (1 - minRatio) * height);
      maxHandleElement.translate(0, (1 - maxRatio) * height);
    }
  };

  _proto._renderHorizontal = function _renderHorizontal() {
    this._transform('horizontal');
  };

  _proto._renderVertical = function _renderVertical() {
    this._transform('vertical');
  };

  _proto._bindUI = function _bindUI() {
    this.on('mousedown', Util.wrapBehavior(this, '_onMouseDown'));
  };

  _proto._isElement = function _isElement(target, name) {
    // 判断是否是该元素
    var element = this.get(name);

    if (target === element) {
      return true;
    }

    if (element.isGroup) {
      var elementChildren = element.get('children');
      return elementChildren.indexOf(target) > -1;
    }

    return false;
  };

  _proto._getRange = function _getRange(diff, range) {
    var rst = diff + range;
    rst = rst > 100 ? 100 : rst;
    rst = rst < 0 ? 0 : rst;
    return rst;
  };

  _proto._limitRange = function _limitRange(diff, limit, range) {
    range[0] = this._getRange(diff, range[0]);
    range[1] = range[0] + limit;

    if (range[1] > 100) {
      range[1] = 100;
      range[0] = range[1] - limit;
    }
  };

  _proto._updateStatus = function _updateStatus(dim, ev) {
    var totalLength = dim === 'x' ? this.get('width') : this.get('height');
    dim = Util.upperFirst(dim);
    var range = this.get('range');
    var page = this.get('page' + dim);
    var currentTarget = this.get('currentTarget');
    var rangeStash = this.get('rangeStash');
    var layout = this.get('layout');
    var sign = layout === 'vertical' ? -1 : 1;
    var currentPage = ev['page' + dim];
    var diffPage = currentPage - page;
    var diffRange = diffPage / totalLength * 100 * sign;
    var diffStashRange;
    var minRange = this.get('minRange');
    var maxRange = this.get('maxRange');

    if (range[1] <= range[0]) {
      if (this._isElement(currentTarget, 'minHandleElement') || this._isElement(currentTarget, 'maxHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);
        range[1] = this._getRange(diffRange, range[0]);
      }
    } else {
      if (this._isElement(currentTarget, 'minHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);

        if (minRange) {
          // 设置了最小范围
          if (range[1] - range[0] <= minRange) {
            this._limitRange(diffRange, minRange, range);
          }
        }

        if (maxRange) {
          // 设置了最大范围
          if (range[1] - range[0] >= maxRange) {
            this._limitRange(diffRange, maxRange, range);
          }
        }
      }

      if (this._isElement(currentTarget, 'maxHandleElement')) {
        range[1] = this._getRange(diffRange, range[1]);

        if (minRange) {
          // 设置了最小范围
          if (range[1] - range[0] <= minRange) {
            this._limitRange(diffRange, minRange, range);
          }
        }

        if (maxRange) {
          // 设置了最大范围
          if (range[1] - range[0] >= maxRange) {
            this._limitRange(diffRange, maxRange, range);
          }
        }
      }
    }

    if (this._isElement(currentTarget, 'middleHandleElement')) {
      diffStashRange = rangeStash[1] - rangeStash[0];

      this._limitRange(diffRange, diffStashRange, range);
    }

    this.emit('sliderchange', {
      range: range
    });
    this.set('page' + dim, currentPage);

    this._renderUI();

    this.get('canvas').draw(); // need delete

    return;
  };

  _proto._onMouseDown = function _onMouseDown(ev) {
    var currentTarget = ev.currentTarget;
    var originEvent = ev.event;
    var range = this.get('range');
    originEvent.stopPropagation();
    originEvent.preventDefault();
    this.set('pageX', originEvent.pageX);
    this.set('pageY', originEvent.pageY);
    this.set('currentTarget', currentTarget);
    this.set('rangeStash', [range[0], range[1]]);

    this._bindCanvasEvents();
  };

  _proto._bindCanvasEvents = function _bindCanvasEvents() {
    var containerDOM = this.get('canvas').get('containerDOM');
    this.onMouseMoveListener = DomUtil.addEventListener(containerDOM, 'mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseUpListener = DomUtil.addEventListener(containerDOM, 'mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp')); // @2018-06-06 by blue.lb 添加mouseleave事件监听，让用户在操作出滑块区域后有一个“正常”的效果，可以正常重新触发滑块的操作流程

    this.onMouseLeaveListener = DomUtil.addEventListener(containerDOM, 'mouseleave', Util.wrapBehavior(this, '_onCanvasMouseUp'));
  };

  _proto._onCanvasMouseMove = function _onCanvasMouseMove(ev) {
    var layout = this.get('layout');

    if (layout === 'horizontal') {
      this._updateStatus('x', ev);
    } else {
      this._updateStatus('y', ev);
    }
  };

  _proto._onCanvasMouseUp = function _onCanvasMouseUp() {
    this._removeDocumentEvents();
  };

  _proto._removeDocumentEvents = function _removeDocumentEvents() {
    this.onMouseMoveListener.remove();
    this.onMouseUpListener.remove();
    this.onMouseLeaveListener.remove();
  };

  return Range;
}(Group);

module.exports = Range;

/***/ })
/******/ ]);
});