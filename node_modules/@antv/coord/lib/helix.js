"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @fileOverview the class of Helix Coordinate
 * @author sima.zhang
 */
var MatrixUtil = require('@antv/util/lib/matrix/');

var isNumberEqual = require('@antv/util/lib/math/is-number-equal');

var mix = require('@antv/util/lib/mix');

var Base = require('./base');

var vec2 = MatrixUtil.vec2;

var Helix =
/*#__PURE__*/
function (_Base) {
  _inherits(Helix, _Base);

  _createClass(Helix, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Helix.prototype), "getDefaultCfg", this).call(this);

      return mix({}, cfg, {
        startAngle: 1.25 * Math.PI,
        endAngle: 7.25 * Math.PI,
        innerRadius: 0,
        type: 'helix',
        isHelix: true
      });
    }
  }]);

  function Helix(cfg) {
    var _this;

    _classCallCheck(this, Helix);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Helix).call(this, cfg));

    _this._init();

    return _this;
  }

  _createClass(Helix, [{
    key: "_init",
    value: function _init() {
      var width = this.width;
      var height = this.height;
      var radius = this.radius;
      var innerRadius = this.innerRadius;
      var startAngle = this.startAngle;
      var endAngle = this.endAngle;
      var index = (endAngle - startAngle) / (2 * Math.PI) + 1; // 螺线圈数

      var maxRadius = Math.min(width, height) / 2;

      if (radius && radius >= 0 && radius <= 1) {
        maxRadius = maxRadius * radius;
      }

      var d = Math.floor(maxRadius * (1 - innerRadius) / index);
      var a = d / (Math.PI * 2); // 螺线系数

      var x = {
        start: startAngle,
        end: endAngle
      };
      var y = {
        start: innerRadius * maxRadius,
        end: innerRadius * maxRadius + d * 0.99
      };
      this.a = a;
      this.d = d;
      this.x = x;
      this.y = y;
    }
  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.center;
    }
    /**
     * 将百分比数据变成屏幕坐标
     * @param  {Object} point 归一化的点坐标
     * @return {Object}       返回对应的屏幕坐标
     */

  }, {
    key: "convertPoint",
    value: function convertPoint(point) {
      var a = this.a;
      var center = this.center;
      var x;
      var y;

      if (this.isTransposed) {
        x = point.y;
        y = point.x;
      } else {
        x = point.x;
        y = point.y;
      }

      var thi = this.convertDim(x, 'x');
      var r = a * thi;
      var newY = this.convertDim(y, 'y');
      return {
        x: center.x + Math.cos(thi) * (r + newY),
        y: center.y + Math.sin(thi) * (r + newY)
      };
    }
    /**
     * 将屏幕坐标点还原成百分比数据
     * @param  {Object} point 屏幕坐标
     * @return {Object}       返回对应的归一化后的数据
     */

  }, {
    key: "invertPoint",
    value: function invertPoint(point) {
      var center = this.center;
      var a = this.a;
      var d = this.d + this.y.start;
      var v = vec2.subtract([], [point.x, point.y], [center.x, center.y]);
      var thi = vec2.angleTo(v, [1, 0], true);
      var rMin = thi * a; // 坐标与原点的连线在第一圈上的交点，最小r值

      if (vec2.length(v) < rMin) {
        // 坐标与原点的连线不可能小于最小r值，但不排除因小数计算产生的略小于rMin的情况
        rMin = vec2.length(v);
      }

      var index = Math.floor((vec2.length(v) - rMin) / d); // 当前点位于第index圈

      thi = 2 * index * Math.PI + thi;
      var r = a * thi;
      var newY = vec2.length(v) - r;
      newY = isNumberEqual(newY, 0) ? 0 : newY;
      var x = this.invertDim(thi, 'x');
      var y = this.invertDim(newY, 'y');
      x = isNumberEqual(x, 0) ? 0 : x;
      y = isNumberEqual(y, 0) ? 0 : y;
      var rst = {};
      rst.x = this.isTransposed ? y : x;
      rst.y = this.isTransposed ? x : y;
      return rst;
    }
  }]);

  return Helix;
}(Base);

module.exports = Helix;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxpeC5qcyJdLCJuYW1lcyI6WyJNYXRyaXhVdGlsIiwicmVxdWlyZSIsImlzTnVtYmVyRXF1YWwiLCJtaXgiLCJCYXNlIiwidmVjMiIsIkhlbGl4IiwiY2ZnIiwic3RhcnRBbmdsZSIsIk1hdGgiLCJQSSIsImVuZEFuZ2xlIiwiaW5uZXJSYWRpdXMiLCJ0eXBlIiwiaXNIZWxpeCIsIl9pbml0Iiwid2lkdGgiLCJoZWlnaHQiLCJyYWRpdXMiLCJpbmRleCIsIm1heFJhZGl1cyIsIm1pbiIsImQiLCJmbG9vciIsImEiLCJ4Iiwic3RhcnQiLCJlbmQiLCJ5IiwiY2VudGVyIiwicG9pbnQiLCJpc1RyYW5zcG9zZWQiLCJ0aGkiLCJjb252ZXJ0RGltIiwiciIsIm5ld1kiLCJjb3MiLCJzaW4iLCJ2Iiwic3VidHJhY3QiLCJhbmdsZVRvIiwick1pbiIsImxlbmd0aCIsImludmVydERpbSIsInJzdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBTUEsVUFBVSxHQUFHQyxPQUFPLENBQUMsd0JBQUQsQ0FBMUI7O0FBQ0EsSUFBTUMsYUFBYSxHQUFHRCxPQUFPLENBQUMscUNBQUQsQ0FBN0I7O0FBQ0EsSUFBTUUsR0FBRyxHQUFHRixPQUFPLENBQUMsb0JBQUQsQ0FBbkI7O0FBQ0EsSUFBTUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsUUFBRCxDQUFwQjs7QUFFQSxJQUFNSSxJQUFJLEdBQUdMLFVBQVUsQ0FBQ0ssSUFBeEI7O0lBRU1DLEs7Ozs7Ozs7b0NBRVk7QUFDZCxVQUFNQyxHQUFHLDJFQUFUOztBQUNBLGFBQU9KLEdBQUcsQ0FBQyxFQUFELEVBQUtJLEdBQUwsRUFBVTtBQUNsQkMsUUFBQUEsVUFBVSxFQUFFLE9BQU9DLElBQUksQ0FBQ0MsRUFETjtBQUVsQkMsUUFBQUEsUUFBUSxFQUFFLE9BQU9GLElBQUksQ0FBQ0MsRUFGSjtBQUdsQkUsUUFBQUEsV0FBVyxFQUFFLENBSEs7QUFJbEJDLFFBQUFBLElBQUksRUFBRSxPQUpZO0FBS2xCQyxRQUFBQSxPQUFPLEVBQUU7QUFMUyxPQUFWLENBQVY7QUFPRDs7O0FBRUQsaUJBQVlQLEdBQVosRUFBaUI7QUFBQTs7QUFBQTs7QUFDZiwrRUFBTUEsR0FBTjs7QUFDQSxVQUFLUSxLQUFMOztBQUZlO0FBR2hCOzs7OzRCQUVPO0FBQ04sVUFBTUMsS0FBSyxHQUFHLEtBQUtBLEtBQW5CO0FBQ0EsVUFBTUMsTUFBTSxHQUFHLEtBQUtBLE1BQXBCO0FBQ0EsVUFBTUMsTUFBTSxHQUFHLEtBQUtBLE1BQXBCO0FBQ0EsVUFBTU4sV0FBVyxHQUFHLEtBQUtBLFdBQXpCO0FBQ0EsVUFBTUosVUFBVSxHQUFHLEtBQUtBLFVBQXhCO0FBQ0EsVUFBTUcsUUFBUSxHQUFHLEtBQUtBLFFBQXRCO0FBRUEsVUFBTVEsS0FBSyxHQUFHLENBQUNSLFFBQVEsR0FBR0gsVUFBWixLQUEyQixJQUFJQyxJQUFJLENBQUNDLEVBQXBDLElBQTBDLENBQXhELENBUk0sQ0FRcUQ7O0FBQzNELFVBQUlVLFNBQVMsR0FBR1gsSUFBSSxDQUFDWSxHQUFMLENBQVNMLEtBQVQsRUFBZ0JDLE1BQWhCLElBQTBCLENBQTFDOztBQUNBLFVBQUlDLE1BQU0sSUFBSUEsTUFBTSxJQUFJLENBQXBCLElBQXlCQSxNQUFNLElBQUksQ0FBdkMsRUFBMEM7QUFDeENFLFFBQUFBLFNBQVMsR0FBR0EsU0FBUyxHQUFHRixNQUF4QjtBQUNEOztBQUVELFVBQU1JLENBQUMsR0FBR2IsSUFBSSxDQUFDYyxLQUFMLENBQVdILFNBQVMsSUFBSSxJQUFJUixXQUFSLENBQVQsR0FBZ0NPLEtBQTNDLENBQVY7QUFDQSxVQUFNSyxDQUFDLEdBQUdGLENBQUMsSUFBSWIsSUFBSSxDQUFDQyxFQUFMLEdBQVUsQ0FBZCxDQUFYLENBZk0sQ0Flc0I7O0FBRTVCLFVBQU1lLENBQUMsR0FBRztBQUNSQyxRQUFBQSxLQUFLLEVBQUVsQixVQURDO0FBRVJtQixRQUFBQSxHQUFHLEVBQUVoQjtBQUZHLE9BQVY7QUFJQSxVQUFNaUIsQ0FBQyxHQUFHO0FBQ1JGLFFBQUFBLEtBQUssRUFBRWQsV0FBVyxHQUFHUSxTQURiO0FBRVJPLFFBQUFBLEdBQUcsRUFBRWYsV0FBVyxHQUFHUSxTQUFkLEdBQTBCRSxDQUFDLEdBQUc7QUFGM0IsT0FBVjtBQUtBLFdBQUtFLENBQUwsR0FBU0EsQ0FBVDtBQUNBLFdBQUtGLENBQUwsR0FBU0EsQ0FBVDtBQUNBLFdBQUtHLENBQUwsR0FBU0EsQ0FBVDtBQUNBLFdBQUtHLENBQUwsR0FBU0EsQ0FBVDtBQUNEOzs7Z0NBRVc7QUFDVixhQUFPLEtBQUtDLE1BQVo7QUFDRDtBQUVEOzs7Ozs7OztpQ0FLYUMsSyxFQUFPO0FBQ2xCLFVBQU1OLENBQUMsR0FBRyxLQUFLQSxDQUFmO0FBQ0EsVUFBTUssTUFBTSxHQUFHLEtBQUtBLE1BQXBCO0FBQ0EsVUFBSUosQ0FBSjtBQUNBLFVBQUlHLENBQUo7O0FBRUEsVUFBSSxLQUFLRyxZQUFULEVBQXVCO0FBQ3JCTixRQUFBQSxDQUFDLEdBQUdLLEtBQUssQ0FBQ0YsQ0FBVjtBQUNBQSxRQUFBQSxDQUFDLEdBQUdFLEtBQUssQ0FBQ0wsQ0FBVjtBQUNELE9BSEQsTUFHTztBQUNMQSxRQUFBQSxDQUFDLEdBQUdLLEtBQUssQ0FBQ0wsQ0FBVjtBQUNBRyxRQUFBQSxDQUFDLEdBQUdFLEtBQUssQ0FBQ0YsQ0FBVjtBQUNEOztBQUVELFVBQU1JLEdBQUcsR0FBRyxLQUFLQyxVQUFMLENBQWdCUixDQUFoQixFQUFtQixHQUFuQixDQUFaO0FBQ0EsVUFBTVMsQ0FBQyxHQUFHVixDQUFDLEdBQUdRLEdBQWQ7QUFDQSxVQUFNRyxJQUFJLEdBQUcsS0FBS0YsVUFBTCxDQUFnQkwsQ0FBaEIsRUFBbUIsR0FBbkIsQ0FBYjtBQUVBLGFBQU87QUFDTEgsUUFBQUEsQ0FBQyxFQUFFSSxNQUFNLENBQUNKLENBQVAsR0FBV2hCLElBQUksQ0FBQzJCLEdBQUwsQ0FBU0osR0FBVCxLQUFpQkUsQ0FBQyxHQUFHQyxJQUFyQixDQURUO0FBRUxQLFFBQUFBLENBQUMsRUFBRUMsTUFBTSxDQUFDRCxDQUFQLEdBQVduQixJQUFJLENBQUM0QixHQUFMLENBQVNMLEdBQVQsS0FBaUJFLENBQUMsR0FBR0MsSUFBckI7QUFGVCxPQUFQO0FBSUQ7QUFFRDs7Ozs7Ozs7Z0NBS1lMLEssRUFBTztBQUNqQixVQUFNRCxNQUFNLEdBQUcsS0FBS0EsTUFBcEI7QUFDQSxVQUFNTCxDQUFDLEdBQUcsS0FBS0EsQ0FBZjtBQUNBLFVBQU1GLENBQUMsR0FBRyxLQUFLQSxDQUFMLEdBQVMsS0FBS00sQ0FBTCxDQUFPRixLQUExQjtBQUNBLFVBQU1ZLENBQUMsR0FBR2pDLElBQUksQ0FBQ2tDLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLENBQUVULEtBQUssQ0FBQ0wsQ0FBUixFQUFXSyxLQUFLLENBQUNGLENBQWpCLENBQWxCLEVBQXdDLENBQUVDLE1BQU0sQ0FBQ0osQ0FBVCxFQUFZSSxNQUFNLENBQUNELENBQW5CLENBQXhDLENBQVY7QUFDQSxVQUFJSSxHQUFHLEdBQUczQixJQUFJLENBQUNtQyxPQUFMLENBQWFGLENBQWIsRUFBZ0IsQ0FBRSxDQUFGLEVBQUssQ0FBTCxDQUFoQixFQUEwQixJQUExQixDQUFWO0FBQ0EsVUFBSUcsSUFBSSxHQUFHVCxHQUFHLEdBQUdSLENBQWpCLENBTmlCLENBTUc7O0FBRXBCLFVBQUluQixJQUFJLENBQUNxQyxNQUFMLENBQVlKLENBQVosSUFBaUJHLElBQXJCLEVBQTJCO0FBQUc7QUFDNUJBLFFBQUFBLElBQUksR0FBR3BDLElBQUksQ0FBQ3FDLE1BQUwsQ0FBWUosQ0FBWixDQUFQO0FBQ0Q7O0FBRUQsVUFBTW5CLEtBQUssR0FBR1YsSUFBSSxDQUFDYyxLQUFMLENBQVcsQ0FBQ2xCLElBQUksQ0FBQ3FDLE1BQUwsQ0FBWUosQ0FBWixJQUFpQkcsSUFBbEIsSUFBMEJuQixDQUFyQyxDQUFkLENBWmlCLENBWXNDOztBQUN2RFUsTUFBQUEsR0FBRyxHQUFHLElBQUliLEtBQUosR0FBWVYsSUFBSSxDQUFDQyxFQUFqQixHQUFzQnNCLEdBQTVCO0FBQ0EsVUFBTUUsQ0FBQyxHQUFHVixDQUFDLEdBQUdRLEdBQWQ7QUFDQSxVQUFJRyxJQUFJLEdBQUc5QixJQUFJLENBQUNxQyxNQUFMLENBQVlKLENBQVosSUFBaUJKLENBQTVCO0FBQ0FDLE1BQUFBLElBQUksR0FBR2pDLGFBQWEsQ0FBQ2lDLElBQUQsRUFBTyxDQUFQLENBQWIsR0FBeUIsQ0FBekIsR0FBNkJBLElBQXBDO0FBRUEsVUFBSVYsQ0FBQyxHQUFHLEtBQUtrQixTQUFMLENBQWVYLEdBQWYsRUFBb0IsR0FBcEIsQ0FBUjtBQUNBLFVBQUlKLENBQUMsR0FBRyxLQUFLZSxTQUFMLENBQWVSLElBQWYsRUFBcUIsR0FBckIsQ0FBUjtBQUNBVixNQUFBQSxDQUFDLEdBQUd2QixhQUFhLENBQUN1QixDQUFELEVBQUksQ0FBSixDQUFiLEdBQXNCLENBQXRCLEdBQTBCQSxDQUE5QjtBQUNBRyxNQUFBQSxDQUFDLEdBQUcxQixhQUFhLENBQUMwQixDQUFELEVBQUksQ0FBSixDQUFiLEdBQXNCLENBQXRCLEdBQTBCQSxDQUE5QjtBQUVBLFVBQU1nQixHQUFHLEdBQUcsRUFBWjtBQUNBQSxNQUFBQSxHQUFHLENBQUNuQixDQUFKLEdBQVEsS0FBS00sWUFBTCxHQUFvQkgsQ0FBcEIsR0FBd0JILENBQWhDO0FBQ0FtQixNQUFBQSxHQUFHLENBQUNoQixDQUFKLEdBQVEsS0FBS0csWUFBTCxHQUFvQk4sQ0FBcEIsR0FBd0JHLENBQWhDO0FBQ0EsYUFBT2dCLEdBQVA7QUFDRDs7OztFQW5IaUJ4QyxJOztBQXNIcEJ5QyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ4QyxLQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyB0aGUgY2xhc3Mgb2YgSGVsaXggQ29vcmRpbmF0ZVxuICogQGF1dGhvciBzaW1hLnpoYW5nXG4gKi9cbmNvbnN0IE1hdHJpeFV0aWwgPSByZXF1aXJlKCdAYW50di91dGlsL2xpYi9tYXRyaXgvJyk7XG5jb25zdCBpc051bWJlckVxdWFsID0gcmVxdWlyZSgnQGFudHYvdXRpbC9saWIvbWF0aC9pcy1udW1iZXItZXF1YWwnKTtcbmNvbnN0IG1peCA9IHJlcXVpcmUoJ0BhbnR2L3V0aWwvbGliL21peCcpO1xuY29uc3QgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG5jb25zdCB2ZWMyID0gTWF0cml4VXRpbC52ZWMyO1xuXG5jbGFzcyBIZWxpeCBleHRlbmRzIEJhc2Uge1xuXG4gIGdldERlZmF1bHRDZmcoKSB7XG4gICAgY29uc3QgY2ZnID0gc3VwZXIuZ2V0RGVmYXVsdENmZygpO1xuICAgIHJldHVybiBtaXgoe30sIGNmZywge1xuICAgICAgc3RhcnRBbmdsZTogMS4yNSAqIE1hdGguUEksXG4gICAgICBlbmRBbmdsZTogNy4yNSAqIE1hdGguUEksXG4gICAgICBpbm5lclJhZGl1czogMCxcbiAgICAgIHR5cGU6ICdoZWxpeCcsXG4gICAgICBpc0hlbGl4OiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihjZmcpIHtcbiAgICBzdXBlcihjZmcpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIF9pbml0KCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnJhZGl1cztcbiAgICBjb25zdCBpbm5lclJhZGl1cyA9IHRoaXMuaW5uZXJSYWRpdXM7XG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnRBbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHRoaXMuZW5kQW5nbGU7XG5cbiAgICBjb25zdCBpbmRleCA9IChlbmRBbmdsZSAtIHN0YXJ0QW5nbGUpIC8gKDIgKiBNYXRoLlBJKSArIDE7IC8vIOieuue6v+WciOaVsFxuICAgIGxldCBtYXhSYWRpdXMgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDI7XG4gICAgaWYgKHJhZGl1cyAmJiByYWRpdXMgPj0gMCAmJiByYWRpdXMgPD0gMSkge1xuICAgICAgbWF4UmFkaXVzID0gbWF4UmFkaXVzICogcmFkaXVzO1xuICAgIH1cblxuICAgIGNvbnN0IGQgPSBNYXRoLmZsb29yKG1heFJhZGl1cyAqICgxIC0gaW5uZXJSYWRpdXMpIC8gaW5kZXgpO1xuICAgIGNvbnN0IGEgPSBkIC8gKE1hdGguUEkgKiAyKTsvLyDonrrnur/ns7vmlbBcblxuICAgIGNvbnN0IHggPSB7XG4gICAgICBzdGFydDogc3RhcnRBbmdsZSxcbiAgICAgIGVuZDogZW5kQW5nbGVcbiAgICB9O1xuICAgIGNvbnN0IHkgPSB7XG4gICAgICBzdGFydDogaW5uZXJSYWRpdXMgKiBtYXhSYWRpdXMsXG4gICAgICBlbmQ6IGlubmVyUmFkaXVzICogbWF4UmFkaXVzICsgZCAqIDAuOTlcbiAgICB9O1xuXG4gICAgdGhpcy5hID0gYTtcbiAgICB0aGlzLmQgPSBkO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIGdldENlbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXI7XG4gIH1cblxuICAvKipcbiAgICog5bCG55m+5YiG5q+U5pWw5o2u5Y+Y5oiQ5bGP5bmV5Z2Q5qCHXG4gICAqIEBwYXJhbSAge09iamVjdH0gcG9pbnQg5b2S5LiA5YyW55qE54K55Z2Q5qCHXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAg6L+U5Zue5a+55bqU55qE5bGP5bmV5Z2Q5qCHXG4gICAqL1xuICBjb252ZXJ0UG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBhID0gdGhpcy5hO1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2VudGVyO1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuXG4gICAgaWYgKHRoaXMuaXNUcmFuc3Bvc2VkKSB7XG4gICAgICB4ID0gcG9pbnQueTtcbiAgICAgIHkgPSBwb2ludC54O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0gcG9pbnQueDtcbiAgICAgIHkgPSBwb2ludC55O1xuICAgIH1cblxuICAgIGNvbnN0IHRoaSA9IHRoaXMuY29udmVydERpbSh4LCAneCcpO1xuICAgIGNvbnN0IHIgPSBhICogdGhpO1xuICAgIGNvbnN0IG5ld1kgPSB0aGlzLmNvbnZlcnREaW0oeSwgJ3knKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBjZW50ZXIueCArIE1hdGguY29zKHRoaSkgKiAociArIG5ld1kpLFxuICAgICAgeTogY2VudGVyLnkgKyBNYXRoLnNpbih0aGkpICogKHIgKyBuZXdZKVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog5bCG5bGP5bmV5Z2Q5qCH54K56L+Y5Y6f5oiQ55m+5YiG5q+U5pWw5o2uXG4gICAqIEBwYXJhbSAge09iamVjdH0gcG9pbnQg5bGP5bmV5Z2Q5qCHXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAg6L+U5Zue5a+55bqU55qE5b2S5LiA5YyW5ZCO55qE5pWw5o2uXG4gICAqL1xuICBpbnZlcnRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuY2VudGVyO1xuICAgIGNvbnN0IGEgPSB0aGlzLmE7XG4gICAgY29uc3QgZCA9IHRoaXMuZCArIHRoaXMueS5zdGFydDtcbiAgICBjb25zdCB2ID0gdmVjMi5zdWJ0cmFjdChbXSwgWyBwb2ludC54LCBwb2ludC55IF0sIFsgY2VudGVyLngsIGNlbnRlci55IF0pO1xuICAgIGxldCB0aGkgPSB2ZWMyLmFuZ2xlVG8odiwgWyAxLCAwIF0sIHRydWUpO1xuICAgIGxldCByTWluID0gdGhpICogYTsgLy8g5Z2Q5qCH5LiO5Y6f54K555qE6L+e57q/5Zyo56ys5LiA5ZyI5LiK55qE5Lqk54K577yM5pyA5bCPcuWAvFxuXG4gICAgaWYgKHZlYzIubGVuZ3RoKHYpIDwgck1pbikgeyAgLy8g5Z2Q5qCH5LiO5Y6f54K555qE6L+e57q/5LiN5Y+v6IO95bCP5LqO5pyA5bCPcuWAvO+8jOS9huS4jeaOkumZpOWboOWwj+aVsOiuoeeul+S6p+eUn+eahOeVpeWwj+S6jnJNaW7nmoTmg4XlhrVcbiAgICAgIHJNaW4gPSB2ZWMyLmxlbmd0aCh2KTtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHZlYzIubGVuZ3RoKHYpIC0gck1pbikgLyBkKTsgLy8g5b2T5YmN54K55L2N5LqO56ysaW5kZXjlnIhcbiAgICB0aGkgPSAyICogaW5kZXggKiBNYXRoLlBJICsgdGhpO1xuICAgIGNvbnN0IHIgPSBhICogdGhpO1xuICAgIGxldCBuZXdZID0gdmVjMi5sZW5ndGgodikgLSByO1xuICAgIG5ld1kgPSBpc051bWJlckVxdWFsKG5ld1ksIDApID8gMCA6IG5ld1k7XG5cbiAgICBsZXQgeCA9IHRoaXMuaW52ZXJ0RGltKHRoaSwgJ3gnKTtcbiAgICBsZXQgeSA9IHRoaXMuaW52ZXJ0RGltKG5ld1ksICd5Jyk7XG4gICAgeCA9IGlzTnVtYmVyRXF1YWwoeCwgMCkgPyAwIDogeDtcbiAgICB5ID0gaXNOdW1iZXJFcXVhbCh5LCAwKSA/IDAgOiB5O1xuXG4gICAgY29uc3QgcnN0ID0ge307XG4gICAgcnN0LnggPSB0aGlzLmlzVHJhbnNwb3NlZCA/IHkgOiB4O1xuICAgIHJzdC55ID0gdGhpcy5pc1RyYW5zcG9zZWQgPyB4IDogeTtcbiAgICByZXR1cm4gcnN0O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSGVsaXg7XG4iXX0=