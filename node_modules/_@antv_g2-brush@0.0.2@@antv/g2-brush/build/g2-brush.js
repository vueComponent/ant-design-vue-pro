(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Brush"] = factory();
	else
		root["Brush"] = factory();
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

/**
 * g2-brush
 * @author sima.zhang1990@gmail.com
 */
var Brush = __webpack_require__(1);
module.exports = Brush;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * g2-brush
 * @author sima.zhang1990@gmail.com
 */
var Util = __webpack_require__(2);
var BRUSH_TYPES = ['X', 'Y', 'XY', 'POLYGON'];

var Brush = function () {
  function Brush(cfg) {
    _classCallCheck(this, Brush);

    /**
     * keep the first mousedown point
     * @type {object}
     */
    this.startPoint = null;
    /**
     * keep the brush state
     * @type {Boolean}
     */
    this.brushing = false;
    /**
     * keep the drag state
     * @type {Boolean}
     */
    this.dragging = false;
    /**
     * the brush shape
     * @type {G.Shape}
     */
    this.brushShape = null;
    /**
     * the brush container
     * @type {G.Group}
     */
    this.container = null;
    /**
     * keep polygon path
     * @type {String}
     */
    this.polygonPath = null;
    /**
     * brush style
     * @type {Object}
     */
    this.style = {
      fill: '#C5D4EB',
      opacity: 0.3,
      lineWidth: 1,
      stroke: '#82A6DD'
    };
    /**
     * brush type
     * @type {string}
     */
    this.type = 'XY';
    /**
     * is brushShape can be dragable, default is false
     * @type {Boolean}
     */
    this.dragable = false;
    this.dragoffX = 0;
    this.dragoffY = 0;
    /**
     * is limited in plot, default value is true
     * @type {Boolean}
     */
    this.inPlot = true;
    /**
     * xField
     * @type {string}
     */
    this.xField = null;
    /**
     * yFiels
     * @type {string}
     */
    this.yField = null;
    /**
     * Whether to filter the data，default is true
     * @type {Boolean}
     */
    this.filter = !cfg.dragable;
    this.onBrushstart = null;
    this.onBrushmove = null;
    this.onBrushend = null;
    this.onDragstart = null;
    this.onDragmove = null;
    this.onDragend = null;

    this._init(cfg);
  }

  Brush.prototype._init = function _init(cfg) {
    Util.mix(this, cfg);
    this.type = this.type.toUpperCase();
    if (BRUSH_TYPES.indexOf(this.type) === -1) {
      this.type = 'XY';
    }
    var canvas = this.canvas;
    if (canvas) {
      var plotRange = void 0;
      canvas.get('children').map(function (child) {
        if (child.get('type') === 'plotBack') {
          plotRange = child.get('plotRange');
          return false;
        }
        return child;
      });
      this.plot = {
        start: plotRange.bl,
        end: plotRange.tr
      };

      this.bindCanvasEvent();
    }

    if (this.chart) {
      var chart = this.chart;
      var coord = chart.get('coord');
      this.plot = {
        start: coord.start,
        end: coord.end
      };
      var xScales = chart._getScales('x');
      var yScales = chart._getScales('y');
      this.xScale = this.xField ? xScales[this.xField] : chart.getXScale();
      this.yScale = this.yField ? yScales[this.yField] : chart.getYScales()[0];
    }
  };

  Brush.prototype.clearEvents = function clearEvents() {
    this.onMouseDownListener && this.onMouseDownListener.remove();
    this.onMouseMoveListener && this.onMouseMoveListener.remove();
    this.onMouseupListener && this.onMouseupListener.remove();
  };

  Brush.prototype.bindCanvasEvent = function bindCanvasEvent() {
    var canvas = this.canvas;

    var canvasDOM = canvas.get('canvasDOM');
    this.clearEvents();
    this.onMouseDownListener = Util.addEventListener(canvasDOM, 'mousedown', Util.wrapBehavior(this, '_onCanvasMouseDown'));
    this.onMouseMoveListener = Util.addEventListener(canvasDOM, 'mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseUpListener = Util.addEventListener(canvasDOM, 'mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp'));
  };

  Brush.prototype._onCanvasMouseDown = function _onCanvasMouseDown(ev) {
    var me = this;
    var canvas = me.canvas,
        type = me.type,
        brushShape = me.brushShape;


    if (!type) {
      return;
    }

    var startPoint = { x: ev.offsetX, y: ev.offsetY };
    var isInPlot = me.plot && me.inPlot;
    var canvasDOM = canvas.get('canvasDOM');
    var pixelRatio = canvas.get('pixelRatio');

    if (me.selection) {
      me.selection = null;
    }

    if (me.dragable && brushShape && !brushShape.get('destroyed')) {
      // allow drag the brushShape
      if (brushShape.isHit(startPoint.x * pixelRatio, startPoint.y * pixelRatio)) {
        canvasDOM.style.cursor = 'move';
        me.selection = brushShape;
        me.dragging = true;
        if (type === 'X') {
          me.dragoffX = startPoint.x - brushShape.attr('x');
          me.dragoffY = 0;
        } else if (type === 'Y') {
          me.dragoffX = 0;
          me.dragoffY = startPoint.y - brushShape.attr('y');
        } else if (type === 'XY') {
          me.dragoffX = startPoint.x - brushShape.attr('x');
          me.dragoffY = startPoint.y - brushShape.attr('y');
        } else if (type === 'POLYGON') {
          var box = brushShape.getBBox();
          me.dragoffX = startPoint.x - box.minX;
          me.dragoffY = startPoint.y - box.minY;
        }

        if (isInPlot) {
          me.selection.attr('clip', canvas.addShape('rect', {
            attrs: {
              x: this.plot.start.x,
              y: this.plot.end.y,
              width: this.plot.end.x - this.plot.start.x,
              height: this.plot.start.y - this.plot.end.y,
              fill: '#fff',
              fillOpacity: 0
            }
          }));
        }
        me.onDragstart && me.onDragstart(ev);
      }
      me.prePoint = startPoint;
    }

    if (!me.dragging) {
      // brush start
      me.onBrushstart && me.onBrushstart(startPoint);
      var container = me.container;
      if (isInPlot) {
        var _me$plot = me.plot,
            start = _me$plot.start,
            end = _me$plot.end;

        if (startPoint.x < start.x || startPoint.x > end.x || startPoint.y < end.y || startPoint.y > start.y) {
          return;
        }
      }
      canvasDOM.style.cursor = 'crosshair';
      me.startPoint = startPoint;
      me.brushShape = null;
      me.brushing = true;

      if (!container) {
        container = canvas.addGroup({
          zIndex: 5 // upper
        });
        container.initTransform();
      } else {
        container.clear();
      }
      me.container = container;

      if (type === 'POLYGON') {
        me.polygonPath = 'M ' + startPoint.x + ' ' + startPoint.y;
      }
    }
  };

  Brush.prototype._onCanvasMouseMove = function _onCanvasMouseMove(ev) {
    var me = this;
    var brushing = me.brushing,
        dragging = me.dragging,
        type = me.type,
        plot = me.plot,
        startPoint = me.startPoint,
        xScale = me.xScale,
        yScale = me.yScale,
        canvas = me.canvas;


    if (!brushing && !dragging) {
      return;
    }
    var currentPoint = {
      x: ev.offsetX,
      y: ev.offsetY
    };
    var canvasDOM = canvas.get('canvasDOM');

    if (brushing) {
      canvasDOM.style.cursor = 'crosshair';
      var start = plot.start,
          end = plot.end;

      var polygonPath = me.polygonPath;
      var brushShape = me.brushShape;
      var container = me.container;
      if (me.plot && me.inPlot) {
        currentPoint = me._limitCoordScope(currentPoint);
      }

      var rectStartX = void 0;
      var rectStartY = void 0;
      var rectWidth = void 0;
      var rectHeight = void 0;

      if (type === 'Y') {
        rectStartX = start.x;
        rectStartY = currentPoint.y >= startPoint.y ? startPoint.y : currentPoint.y;
        rectWidth = Math.abs(start.x - end.x);
        rectHeight = Math.abs(startPoint.y - currentPoint.y);
      } else if (type === 'X') {
        rectStartX = currentPoint.x >= startPoint.x ? startPoint.x : currentPoint.x;
        rectStartY = end.y;
        rectWidth = Math.abs(startPoint.x - currentPoint.x);
        rectHeight = Math.abs(end.y - start.y);
      } else if (type === 'XY') {
        if (currentPoint.x >= startPoint.x) {
          rectStartX = startPoint.x;
          rectStartY = currentPoint.y >= startPoint.y ? startPoint.y : currentPoint.y;
        } else {
          rectStartX = currentPoint.x;
          rectStartY = currentPoint.y >= startPoint.y ? startPoint.y : currentPoint.y;
        }
        rectWidth = Math.abs(startPoint.x - currentPoint.x);
        rectHeight = Math.abs(startPoint.y - currentPoint.y);
      } else if (type === 'POLYGON') {
        polygonPath += 'L ' + currentPoint.x + ' ' + currentPoint.y;
        me.polygonPath = polygonPath;
        if (!brushShape) {
          brushShape = container.addShape('path', {
            attrs: Util.mix(me.style, {
              path: polygonPath
            })
          });
        } else {
          !brushShape.get('destroyed') && brushShape.attr(Util.mix({}, brushShape.__attrs, {
            path: polygonPath
          }));
        }
      }
      if (type !== 'POLYGON') {
        if (!brushShape) {
          brushShape = container.addShape('rect', {
            attrs: Util.mix(me.style, {
              x: rectStartX,
              y: rectStartY,
              width: rectWidth,
              height: rectHeight
            })
          });
        } else {
          !brushShape.get('destroyed') && brushShape.attr(Util.mix({}, brushShape.__attrs, {
            x: rectStartX,
            y: rectStartY,
            width: rectWidth,
            height: rectHeight
          }));
        }
      }

      me.brushShape = brushShape;
    } else if (dragging) {
      canvasDOM.style.cursor = 'move';
      var selection = me.selection;
      if (selection && !selection.get('destroyed')) {
        if (type === 'POLYGON') {
          var prePoint = me.prePoint;
          me.selection.translate(currentPoint.x - prePoint.x, currentPoint.y - prePoint.y);
        } else {
          me.dragoffX && selection.attr('x', currentPoint.x - me.dragoffX);
          me.dragoffY && selection.attr('y', currentPoint.y - me.dragoffY);
        }
      }
    }

    me.prePoint = currentPoint;
    canvas.draw();

    var _me$_getSelected = me._getSelected(),
        data = _me$_getSelected.data,
        shapes = _me$_getSelected.shapes,
        xValues = _me$_getSelected.xValues,
        yValues = _me$_getSelected.yValues;

    var eventObj = {
      data: data,
      shapes: shapes,
      x: currentPoint.x,
      y: currentPoint.y
    };

    if (xScale) {
      eventObj[xScale.field] = xValues;
    }
    if (yScale) {
      eventObj[yScale.field] = yValues;
    }
    me.onDragmove && me.onDragmove(eventObj);
    me.onBrushmove && me.onBrushmove(eventObj);
  };

  Brush.prototype._onCanvasMouseUp = function _onCanvasMouseUp(ev) {
    var me = this;
    var data = me.data,
        shapes = me.shapes,
        xValues = me.xValues,
        yValues = me.yValues,
        canvas = me.canvas,
        type = me.type,
        startPoint = me.startPoint,
        chart = me.chart,
        container = me.container,
        xScale = me.xScale,
        yScale = me.yScale;
    var offsetX = ev.offsetX,
        offsetY = ev.offsetY;

    var canvasDOM = canvas.get('canvasDOM');
    canvasDOM.style.cursor = 'default';

    if (Math.abs(startPoint.x - offsetX) <= 1 && Math.abs(startPoint.y - offsetY) <= 1) {
      // 防止点击事件
      me.brushing = false;
      me.dragging = false;
      return;
    }

    var eventObj = {
      data: data,
      shapes: shapes,
      x: offsetX,
      y: offsetY
    };
    if (xScale) {
      eventObj[xScale.field] = xValues;
    }
    if (yScale) {
      eventObj[yScale.field] = yValues;
    }

    if (me.dragging) {
      me.dragging = false;
      me.onDragend && me.onDragend(eventObj);
    } else if (me.brushing) {
      me.brushing = false;
      var brushShape = me.brushShape;
      var polygonPath = me.polygonPath;

      if (type === 'POLYGON') {
        polygonPath += 'z';

        brushShape && !brushShape.get('destroyed') && brushShape.attr(Util.mix({}, brushShape.__attrs, {
          path: polygonPath
        }));
        me.polygonPath = polygonPath;
        canvas.draw();
      }

      if (me.onBrushend) {
        me.onBrushend(eventObj);
      } else if (chart && me.filter) {
        container.clear(); // clear the brush
        // filter data
        if (type === 'X') {
          xScale && chart.filter(xScale.field, function (val) {
            return xValues.indexOf(val) > -1;
          });
        } else if (type === 'Y') {
          yScale && chart.filter(yScale.field, function (val) {
            return yValues.indexOf(val) > -1;
          });
        } else {
          xScale && chart.filter(xScale.field, function (val) {
            return xValues.indexOf(val) > -1;
          });
          yScale && chart.filter(yScale.field, function (val) {
            return yValues.indexOf(val) > -1;
          });
        }
        chart.repaint();
      }
    }
  };

  Brush.prototype.setType = function setType(type) {
    if (!type) {
      return;
    }

    this.type = type.toUpperCase();
  };

  Brush.prototype.destroy = function destroy() {
    this.clearEvents();
  };

  Brush.prototype._limitCoordScope = function _limitCoordScope(point) {
    var plot = this.plot;
    var start = plot.start,
        end = plot.end;


    if (point.x < start.x) {
      point.x = start.x;
    }
    if (point.x > end.x) {
      point.x = end.x;
    }
    if (point.y < end.y) {
      point.y = end.y;
    }
    if (point.y > start.y) {
      point.y = start.y;
    }
    return point;
  };

  Brush.prototype._getSelected = function _getSelected() {
    var chart = this.chart,
        xScale = this.xScale,
        yScale = this.yScale,
        brushShape = this.brushShape,
        canvas = this.canvas;

    var pixelRatio = canvas.get('pixelRatio');
    var selectedShapes = [];
    var xValues = [];
    var yValues = [];
    var selectedData = [];
    if (chart) {
      var geoms = chart.get('geoms');
      geoms.map(function (geom) {
        var shapes = geom.getShapes();
        shapes.map(function (shape) {
          var shapeData = shape.get('origin');
          if (!Array.isArray(shapeData)) {
            // 线图、区域图等
            shapeData = [shapeData];
          }

          shapeData.map(function (each) {
            if (brushShape.isHit(each.x * pixelRatio, each.y * pixelRatio)) {
              selectedShapes.push(shape);
              var origin = each._origin;
              selectedData.push(origin);
              xScale && xValues.push(origin[xScale.field]);
              yScale && yValues.push(origin[yScale.field]);
            }
            return each;
          });

          return shape;
        });
        return geom;
      });
    }
    this.shapes = selectedShapes;
    this.xValues = xValues;
    this.yValues = yValues;
    this.data = selectedData;
    return {
      data: selectedData,
      xValues: xValues,
      yValues: yValues,
      shapes: selectedShapes
    };
  };

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