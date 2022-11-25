(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Brush"] = factory();
	else
		root["Brush"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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

/**
 * [exports description]
 * @type {Object}
 */
var Brush = __webpack_require__(1);
module.exports = Brush;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * [exports description]
 * @type {Object}
 */
var Util = __webpack_require__(2);

var Brush = function () {
  function Brush(chart, type) {
    _classCallCheck(this, Brush);

    this.startPoint = null;
    this.isBrushing = false;
    this.brushShape = null;
    this.container = null;
    this.polygonPath = null;
    this.polygonPoints = null;

    this.type = type || 'XY';
    this.chart = chart;
    // TODO
    this.canvas = chart.get('canvas');
    this.plotRange = chart.get('plotRange');
    this.frontPlot = chart.get('frontPlot');

    this.bindEvent();
  }

  Brush.prototype.bindEvent = function bindEvent() {
    var me = this;
    var chart = me.chart,
        frontPlot = me.frontPlot,
        type = me.type;


    chart.on('mousedown', function (ev) {
      var x = ev.x,
          y = ev.y;

      var container = me.container;
      me.startPoint = {
        x: x,
        y: y
      };
      me.isBrushing = true; // 开始框选
      if (!container) {
        container = frontPlot.addGroup();
        container.initTransform();
      } else {
        container.clear();
      }
      me.container = container;

      if (type === 'polygon') {
        // 不规则筛选
        me.polygonPoints = [];
        me.polygonPath = 'M ' + x + ' ' + y;
        me.polygonPoints.push([x, y]);
      }
      // 这里抛出 brush start 事件

      // const originEvent = ev.event;
      // originEvent.stopPropagation();
      // originEvent.preventDefault();
      me._bindCanvasEvent();
    });
  };

  Brush.prototype._bindCanvasEvent = function _bindCanvasEvent() {
    var canvas = this.canvas;

    var canvasDOM = canvas.get('canvasDOM');
    // canvasDOM.addEventListener('mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'), false);
    // canvasDOM.addEventListener('mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp'), false);
    this.onMouseMoveListener = Util.addEventListener(canvasDOM, 'mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseUpListener = Util.addEventListener(canvasDOM, 'mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp'));
  };

  Brush.prototype._limitCoordScope = function _limitCoordScope(point) {
    var plotRange = this.plotRange;
    var tl = plotRange.tl,
        br = plotRange.br;


    if (point.x < tl.x) {
      point.x = tl.x;
    }
    if (point.x > br.x) {
      point.x = br.x;
    }
    if (point.y < tl.y) {
      point.y = tl.y;
    }
    if (point.y > br.y) {
      point.y = br.y;
    }
    return point;
  };

  Brush.prototype._onCanvasMouseMove = function _onCanvasMouseMove(ev) {
    var me = this;
    var isBrushing = me.isBrushing,
        type = me.type,
        plotRange = me.plotRange,
        startPoint = me.startPoint;

    if (!isBrushing) {
      return;
    }
    var canvas = me.canvas;
    var tl = plotRange.tl,
        tr = plotRange.tr,
        bl = plotRange.bl;

    var polygonPath = me.polygonPath;
    var polygonPoints = me.polygonPoints;
    var brushShape = me.brushShape;
    var container = me.container;
    var pointX = ev.offsetX;
    var pointY = ev.offsetY;
    var currentPoint = me._limitCoordScope({
      x: pointX,
      y: pointY
    });
    var rectStartX = void 0;
    var rectStartY = void 0;
    var rectWidth = void 0;
    var rectHeight = void 0;

    if (type === 'Y') {
      rectStartX = tl.x;
      rectStartY = currentPoint.y >= startPoint.y ? startPoint.y : currentPoint.y;
      rectWidth = Math.abs(tl.x - tr.x);
      rectHeight = Math.abs(startPoint.y - currentPoint.y);
    } else if (type === 'X') {
      rectStartX = currentPoint.x >= startPoint.x ? startPoint.x : currentPoint.x;
      rectStartY = tl.y;
      rectWidth = Math.abs(startPoint.x - currentPoint.x);
      rectHeight = Math.abs(tl.y - bl.y);
    } else if (type === 'XY') {
      if (currentPoint.x >= startPoint.x) {
        rectStartX = startPoint.x;
        rectStartY = pointY >= startPoint.y ? startPoint.y : currentPoint.y;
      } else {
        rectStartX = currentPoint.x;
        rectStartY = currentPoint.y >= startPoint.y ? startPoint.y : currentPoint.y;
      }
      rectWidth = Math.abs(startPoint.x - currentPoint.x);
      rectHeight = Math.abs(startPoint.y - currentPoint.y);
    } else if (type === 'polygon') {
      // 不规则框选
      polygonPath += 'L ' + pointX + ' ' + pointY;
      polygonPoints.push([pointX, pointY]);
      me.polygonPath = polygonPath;
      me.polygonPoints = polygonPoints;
      if (!brushShape) {
        brushShape = container.addShape('path', {
          attrs: {
            path: polygonPath,
            stroke: '#979797',
            lineWidth: 2,
            fill: '#D8D8D8',
            fillOpacity: 0.5,
            lineDash: [5, 5]
          }
        });
      } else {
        brushShape.attr(Util.mix({}, brushShape.__attrs, {
          path: polygonPath
        }));
      }
    }
    if (type !== 'polygon') {
      if (!brushShape) {
        brushShape = container.addShape('rect', {
          attrs: {
            x: rectStartX,
            y: rectStartY,
            width: rectWidth,
            height: rectHeight,
            fill: '#CCD7EB',
            opacity: 0.4
          }
        });
      } else {
        brushShape.attr(Util.mix({}, brushShape.__attrs, {
          x: rectStartX,
          y: rectStartY,
          width: rectWidth,
          height: rectHeight
        }));
      }
    }

    me.brushShape = brushShape;

    canvas.draw();

    ev.cancelBubble = true;
    ev.returnValue = false;
  };

  Brush.prototype._onCanvasMouseUp = function _onCanvasMouseUp() {
    var me = this;
    var canvas = me.canvas,
        type = me.type;

    var canvasDOM = canvas.get('canvasDOM');

    // canvasDOM.removeEventListener('mousemove', Util.getWrapBehavior(me, '_onCanvasMouseMove'), false);
    // canvasDOM.removeEventListener('mouseup', Util.getWrapBehavior(me, '_onCanvasMouseUp'), false);
    me.onMouseMoveListener.remove();
    me.onMouseUpListener.remove();
    // selectionPlot.clear(); // 一期先默认清楚
    me.isBrushing = false;
    // this.brushShape = null;
    var brushShape = me.brushShape;
    var polygonPath = me.polygonPath;
    var polygonPoints = me.polygonPoints;

    if (type === 'polygon') {
      polygonPath += 'z';
      polygonPoints.push([polygonPoints[0][0], polygonPoints[0][1]]);

      brushShape.attr(Util.mix({}, brushShape.__attrs, {
        path: polygonPath
      }));
      me.polygonPath = polygonPath;
      me.polygonPoints = polygonPoints;
      canvas.draw();
    } else {
      me.brushShape = null;
    }

    // 抛出 brush end 事件
  };

  // setMode(type) {
  //   // TODO: 框选模式转变
  // }


  return Brush;
}();

module.exports = Brush;

/***/ }),
/* 2 */
/***/ (function(module, exports) {


function _mix(dist, obj) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && k !== 'constructor' && obj[k] !== undefined) {
      dist[k] = obj[k];
    }
  }
}

var Util = {
  mix: function mix(dist, obj1, obj2, obj3) {
    if (obj1) {
      _mix(dist, obj1);
    }

    if (obj2) {
      _mix(dist, obj2);
    }

    if (obj3) {
      _mix(dist, obj3);
    }
    return dist;
  },

  /**
   * 添加事件监听器
   * @param  {Object} target DOM对象
   * @param  {String} eventType 事件名
   * @param  {Funtion} callback 回调函数
   * @return {Object} 返回对象
   */
  addEventListener: function addEventListener(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * 封装事件，便于使用上下文this,和便于解除事件时使用
   * @protected
   * @param  {Object} obj   对象
   * @param  {String} action 事件名称
   * @return {Function}        返回事件处理函数
   */
  wrapBehavior: function wrapBehavior(obj, action) {
    if (obj['_wrap_' + action]) {
      return obj['_wrap_' + action];
    }
    var method = function method(e) {
      obj[action](e);
    };
    obj['_wrap_' + action] = method;
    return method;
  },

  /**
   * 获取封装的事件
   * @protected
   * @param  {Object} obj   对象
   * @param  {String} action 事件名称
   * @return {Function}        返回事件处理函数
   */
  getWrapBehavior: function getWrapBehavior(obj, action) {
    return obj['_wrap_' + action];
  }
};

module.exports = Util;

/***/ })
/******/ ]);
});
//# sourceMappingURL=g2-plugin-brush.js.map