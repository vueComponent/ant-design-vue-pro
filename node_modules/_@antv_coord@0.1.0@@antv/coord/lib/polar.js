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
 * @fileOverview the class of Polar Coordinate
 * @author sima.zhang
 */
var MatrixUtil = require('@antv/util/lib/matrix/');

var isNumberEqual = require('@antv/util/lib/math/is-number-equal');

var mix = require('@antv/util/lib/mix');

var Base = require('./base');

var mat3 = MatrixUtil.mat3;
var vec2 = MatrixUtil.vec2;
var vec3 = MatrixUtil.vec3;

var Polar =
/*#__PURE__*/
function (_Base) {
  _inherits(Polar, _Base);

  _createClass(Polar, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Polar.prototype), "getDefaultCfg", this).call(this);

      return mix({}, cfg, {
        startAngle: -Math.PI / 2,
        endAngle: Math.PI * 3 / 2,
        innerRadius: 0,
        type: 'polar',
        isPolar: true
      });
    }
  }]);

  function Polar(cfg) {
    var _this;

    _classCallCheck(this, Polar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Polar).call(this, cfg));

    _this._init();

    return _this;
  }

  _createClass(Polar, [{
    key: "_init",
    value: function _init() {
      var radius = this.radius;
      var innerRadius = this.innerRadius;
      var center = this.center;
      var startAngle = this.startAngle;
      var endAngle = this.endAngle;

      while (endAngle < startAngle) {
        endAngle += Math.PI * 2;
      }

      this.endAngle = endAngle;
      var oneBox = this.getOneBox();
      var oneWidth = oneBox.maxX - oneBox.minX;
      var oneHeight = oneBox.maxY - oneBox.minY;
      var left = Math.abs(oneBox.minX) / oneWidth;
      var top = Math.abs(oneBox.minY) / oneHeight;
      var width = this.width;
      var height = this.height;
      var maxRadius;
      var circleCentre;

      if (height / oneHeight > width / oneWidth) {
        // width为主
        maxRadius = width / oneWidth;
        circleCentre = {
          x: center.x - (0.5 - left) * width,
          y: center.y - (0.5 - top) * maxRadius * oneHeight
        };
      } else {
        // height为主
        maxRadius = height / oneHeight;
        circleCentre = {
          x: center.x - (0.5 - left) * maxRadius * oneWidth,
          y: center.y - (0.5 - top) * height
        };
      }

      if (!radius) {
        radius = maxRadius;
      } else if (radius > 0 && radius <= 1) {
        radius = maxRadius * radius;
      } else if (radius <= 0 || radius > maxRadius) {
        radius = maxRadius;
      }

      var x = {
        start: startAngle,
        end: endAngle
      };
      var y = {
        start: innerRadius * radius,
        end: radius
      };
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.circleCentre = circleCentre;
      this.center = circleCentre;
    }
  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.circleCentre;
    }
  }, {
    key: "getOneBox",
    value: function getOneBox() {
      var startAngle = this.startAngle;
      var endAngle = this.endAngle;

      if (Math.abs(endAngle - startAngle) >= Math.PI * 2) {
        return {
          minX: -1,
          maxX: 1,
          minY: -1,
          maxY: 1
        };
      }

      var xs = [0, Math.cos(startAngle), Math.cos(endAngle)];
      var ys = [0, Math.sin(startAngle), Math.sin(endAngle)];

      for (var i = Math.min(startAngle, endAngle); i < Math.max(startAngle, endAngle); i += Math.PI / 18) {
        xs.push(Math.cos(i));
        ys.push(Math.sin(i));
      }

      return {
        minX: Math.min.apply(Math, xs),
        maxX: Math.max.apply(Math, xs),
        minY: Math.min.apply(Math, ys),
        maxY: Math.max.apply(Math, ys)
      };
    }
  }, {
    key: "getRadius",
    value: function getRadius() {
      return this.radius;
    }
  }, {
    key: "convertPoint",
    value: function convertPoint(point) {
      var center = this.getCenter();
      var x = this.isTransposed ? point.y : point.x;
      var y = this.isTransposed ? point.x : point.y;
      x = this.convertDim(x, 'x');
      y = this.convertDim(y, 'y');
      return {
        x: center.x + Math.cos(x) * y,
        y: center.y + Math.sin(x) * y
      };
    }
  }, {
    key: "invertPoint",
    value: function invertPoint(point) {
      var center = this.getCenter();
      var vPoint = [point.x - center.x, point.y - center.y];
      var x = this.x;
      var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      mat3.rotate(m, m, x.start);
      var vStart = [1, 0, 0];
      vec3.transformMat3(vStart, vStart, m);
      vStart = [vStart[0], vStart[1]];
      var angle = vec2.angleTo(vStart, vPoint, x.end < x.start);

      if (isNumberEqual(angle, Math.PI * 2)) {
        angle = 0;
      }

      var radius = vec2.length(vPoint);
      var xPercent = angle / (x.end - x.start);
      xPercent = x.end - x.start > 0 ? xPercent : -xPercent;
      var yPercent = this.invertDim(radius, 'y');
      var rst = {};
      rst.x = this.isTransposed ? yPercent : xPercent;
      rst.y = this.isTransposed ? xPercent : yPercent;
      return rst;
    }
  }]);

  return Polar;
}(Base);

module.exports = Polar;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2xhci5qcyJdLCJuYW1lcyI6WyJNYXRyaXhVdGlsIiwicmVxdWlyZSIsImlzTnVtYmVyRXF1YWwiLCJtaXgiLCJCYXNlIiwibWF0MyIsInZlYzIiLCJ2ZWMzIiwiUG9sYXIiLCJjZmciLCJzdGFydEFuZ2xlIiwiTWF0aCIsIlBJIiwiZW5kQW5nbGUiLCJpbm5lclJhZGl1cyIsInR5cGUiLCJpc1BvbGFyIiwiX2luaXQiLCJyYWRpdXMiLCJjZW50ZXIiLCJvbmVCb3giLCJnZXRPbmVCb3giLCJvbmVXaWR0aCIsIm1heFgiLCJtaW5YIiwib25lSGVpZ2h0IiwibWF4WSIsIm1pblkiLCJsZWZ0IiwiYWJzIiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJtYXhSYWRpdXMiLCJjaXJjbGVDZW50cmUiLCJ4IiwieSIsInN0YXJ0IiwiZW5kIiwieHMiLCJjb3MiLCJ5cyIsInNpbiIsImkiLCJtaW4iLCJtYXgiLCJwdXNoIiwiYXBwbHkiLCJwb2ludCIsImdldENlbnRlciIsImlzVHJhbnNwb3NlZCIsImNvbnZlcnREaW0iLCJ2UG9pbnQiLCJtIiwicm90YXRlIiwidlN0YXJ0IiwidHJhbnNmb3JtTWF0MyIsImFuZ2xlIiwiYW5nbGVUbyIsImxlbmd0aCIsInhQZXJjZW50IiwieVBlcmNlbnQiLCJpbnZlcnREaW0iLCJyc3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLHdCQUFELENBQTFCOztBQUNBLElBQU1DLGFBQWEsR0FBR0QsT0FBTyxDQUFDLHFDQUFELENBQTdCOztBQUNBLElBQU1FLEdBQUcsR0FBR0YsT0FBTyxDQUFDLG9CQUFELENBQW5COztBQUNBLElBQU1HLElBQUksR0FBR0gsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBRUEsSUFBTUksSUFBSSxHQUFHTCxVQUFVLENBQUNLLElBQXhCO0FBQ0EsSUFBTUMsSUFB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QUFKLEdBQVEsS0FBS2MsWUFBTCxHQUFvQlUsUUFBcEIsR0FBK0JDLFFBQXZDO0FBQ0EsYUFBT0UsR0FBUDtBQUNEOzs7O0VBdkppQjNELEk7O0FBMEpwQjRELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnpELEtBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IHRoZSBjbGFzcyBvZiBQb2xhciBDb29yZGluYXRlXG4gKiBAYXV0aG9yIHNpbWEuemhhbmdcbiAqL1xuY29uc3QgTWF0cml4VXRpbCA9IHJlcXVpcmUoJ0BhbnR2L3V0aWwvbGliL21hdHJpeC8nKTtcbmNvbnN0IGlzTnVtYmVyRXF1YWwgPSByZXF1aXJlKCdAYW50di91dGlsL2xpYi9tYXRoL2lzLW51bWJlci1lcXVhbCcpO1xuY29uc3QgbWl4ID0gcmVxdWlyZSgnQGFudHYvdXRpbC9saWIvbWl4Jyk7XG5jb25zdCBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNvbnN0IG1hdDMgPSBNYXRyaXhVdGlsLm1hdDM7XG5jb25zdCB2ZWMyID0gTWF0cml4VXRpbC52ZWMyO1xuY29uc3QgdmVjMyA9IE1hdHJpeFV0aWwudmVjMztcblxuY2xhc3MgUG9sYXIgZXh0ZW5kcyBCYXNlIHtcblxuICBnZXREZWZhdWx0Q2ZnKCkge1xuICAgIGNvbnN0IGNmZyA9IHN1cGVyLmdldERlZmF1bHRDZmcoKTtcbiAgICByZXR1cm4gbWl4KHt9LCBjZmcsIHtcbiAgICAgIHN0YXJ0QW5nbGU6IC1NYXRoLlBJIC8gMixcbiAgICAgIGVuZEFuZ2xlOiBNYXRoLlBJICogMyAvIDIsXG4gICAgICBpbm5lclJhZGl1czogMCxcbiAgICAgIHR5cGU6ICdwb2xhcicsXG4gICAgICBpc1BvbGFyOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihjZmcpIHtcbiAgICBzdXBlcihjZmcpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIF9pbml0KCkge1xuICAgIGxldCByYWRpdXMgPSB0aGlzLnJhZGl1cztcbiAgICBjb25zdCBpbm5lclJhZGl1cyA9IHRoaXMuaW5uZXJSYWRpdXM7XG4gICAgY29uc3QgY2VudGVyID0gdGhpcy5jZW50ZXI7XG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnRBbmdsZTtcblxuICAgIGxldCBlbmRBbmdsZSA9IHRoaXMuZW5kQW5nbGU7XG4gICAgd2hpbGUgKGVuZEFuZ2xlIDwgc3RhcnRBbmdsZSkge1xuICAgICAgZW5kQW5nbGUgKz0gKE1hdGguUEkgKiAyKTtcbiAgICB9XG4gICAgdGhpcy5lbmRBbmdsZSA9IGVuZEFuZ2xlO1xuICAgIGNvbnN0IG9uZUJveCA9IHRoaXMuZ2V0T25lQm94KCk7XG5cbiAgICBjb25zdCBvbmVXaWR0aCA9IG9uZUJveC5tYXhYIC0gb25lQm94Lm1pblg7XG4gICAgY29uc3Qgb25lSGVpZ2h0ID0gb25lQm94Lm1heFkgLSBvbmVCb3gubWluWTtcbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5hYnMob25lQm94Lm1pblgpIC8gb25lV2lkdGg7XG4gICAgY29uc3QgdG9wID0gTWF0aC5hYnMob25lQm94Lm1pblkpIC8gb25lSGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBsZXQgbWF4UmFkaXVzO1xuICAgIGxldCBjaXJjbGVDZW50cmU7XG4gICAgaWYgKChoZWlnaHQgLyBvbmVIZWlnaHQpID4gKHdpZHRoIC8gb25lV2lkdGgpKSB7IC8vIHdpZHRo5Li65Li7XG4gICAgICBtYXhSYWRpdXMgPSB3aWR0aCAvIG9uZVdpZHRoO1xuICAgICAgY2lyY2xlQ2VudHJlID0ge1xuICAgICAgICB4OiBjZW50ZXIueCAtICgwLjUgLSBsZWZ0KSAqIHdpZHRoLFxuICAgICAgICB5OiBjZW50ZXIueSAtICgwLjUgLSB0b3ApICogbWF4UmFkaXVzICogb25lSGVpZ2h0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7IC8vIGhlaWdodOS4uuS4u1xuICAgICAgbWF4UmFkaXVzID0gaGVpZ2h0IC8gb25lSGVpZ2h0O1xuICAgICAgY2lyY2xlQ2VudHJlID0ge1xuICAgICAgICB4OiBjZW50ZXIueCAtICgwLjUgLSBsZWZ0KSAqIG1heFJhZGl1cyAqIG9uZVdpZHRoLFxuICAgICAgICB5OiBjZW50ZXIueSAtICgwLjUgLSB0b3ApICogaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghcmFkaXVzKSB7XG4gICAgICByYWRpdXMgPSBtYXhSYWRpdXM7XG4gICAgfSBlbHNlIGlmIChyYWRpdXMgPiAwICYmIHJhZGl1cyA8PSAxKSB7XG4gICAgICByYWRpdXMgPSBtYXhSYWRpdXMgKiByYWRpdXM7XG4gICAgfSBlbHNlIGlmIChyYWRpdXMgPD0gMCB8fCByYWRpdXMgPiBtYXhSYWRpdXMpIHtcbiAgICAgIHJhZGl1cyA9IG1heFJhZGl1cztcbiAgICB9XG5cbiAgICBjb25zdCB4ID0ge1xuICAgICAgc3RhcnQ6IHN0YXJ0QW5nbGUsXG4gICAgICBlbmQ6IGVuZEFuZ2xlXG4gICAgfTtcblxuICAgIGNvbnN0IHkgPSB7XG4gICAgICBzdGFydDogaW5uZXJSYWRpdXMgKiByYWRpdXMsXG4gICAgICBlbmQ6IHJhZGl1c1xuICAgIH07XG5cbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5jaXJjbGVDZW50cmUgPSBjaXJjbGVDZW50cmU7XG4gICAgdGhpcy5jZW50ZXIgPSBjaXJjbGVDZW50cmU7XG4gIH1cblxuICBnZXRDZW50ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlQ2VudHJlO1xuICB9XG5cbiAgZ2V0T25lQm94KCkge1xuICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0QW5nbGU7XG4gICAgY29uc3QgZW5kQW5nbGUgPSB0aGlzLmVuZEFuZ2xlO1xuICAgIGlmIChNYXRoLmFicyhlbmRBbmdsZSAtIHN0YXJ0QW5nbGUpID49IE1hdGguUEkgKiAyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW5YOiAtMSxcbiAgICAgICAgbWF4WDogMSxcbiAgICAgICAgbWluWTogLTEsXG4gICAgICAgIG1heFk6IDFcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHhzID0gWyAwLCBNYXRoLmNvcyhzdGFydEFuZ2xlKSwgTWF0aC5jb3MoZW5kQW5nbGUpIF07XG4gICAgY29uc3QgeXMgPSBbIDAsIE1hdGguc2luKHN0YXJ0QW5nbGUpLCBNYXRoLnNpbihlbmRBbmdsZSkgXTtcblxuICAgIGZvciAobGV0IGkgPSBNYXRoLm1pbihzdGFydEFuZ2xlLCBlbmRBbmdsZSk7IGkgPCBNYXRoLm1heChzdGFydEFuZ2xlLCBlbmRBbmdsZSk7IGkgKz0gTWF0aC5QSSAvIDE4KSB7XG4gICAgICB4cy5wdXNoKE1hdGguY29zKGkpKTtcbiAgICAgIHlzLnB1c2goTWF0aC5zaW4oaSkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtaW5YOiBNYXRoLm1pbi5hcHBseShNYXRoLCB4cyksXG4gICAgICBtYXhYOiBNYXRoLm1heC5hcHBseShNYXRoLCB4cyksXG4gICAgICBtaW5ZOiBNYXRoLm1pbi5hcHBseShNYXRoLCB5cyksXG4gICAgICBtYXhZOiBNYXRoLm1heC5hcHBseShNYXRoLCB5cylcbiAgICB9O1xuICB9XG5cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cztcbiAgfVxuXG4gIGNvbnZlcnRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XG4gICAgbGV0IHggPSB0aGlzLmlzVHJhbnNwb3NlZCA/IHBvaW50LnkgOiBwb2ludC54O1xuICAgIGxldCB5ID0gdGhpcy5pc1RyYW5zcG9zZWQgPyBwb2ludC54IDogcG9pbnQueTtcblxuICAgIHggPSB0aGlzLmNvbnZlcnREaW0oeCwgJ3gnKTtcbiAgICB5ID0gdGhpcy5jb252ZXJ0RGltKHksICd5Jyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogY2VudGVyLnggKyBNYXRoLmNvcyh4KSAqIHksXG4gICAgICB5OiBjZW50ZXIueSArIE1hdGguc2luKHgpICogeVxuICAgIH07XG4gIH1cblxuICBpbnZlcnRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XG4gICAgY29uc3QgdlBvaW50ID0gWyBwb2ludC54IC0gY2VudGVyLngsIHBvaW50LnkgLSBjZW50ZXIueSBdO1xuICAgIGNvbnN0IHggPSB0aGlzLng7XG4gICAgY29uc3QgbSA9IFsgMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMSBdO1xuICAgIG1hdDMucm90YXRlKG0sIG0sIHguc3RhcnQpO1xuXG4gICAgbGV0IHZTdGFydCA9IFsgMSwgMCwgMCBdO1xuICAgIHZlYzMudHJhbnNmb3JtTWF0Myh2U3RhcnQsIHZTdGFydCwgbSk7XG4gICAgdlN0YXJ0ID0gWyB2U3RhcnRbMF0sIHZTdGFydFsxXSBdO1xuICAgIGxldCBhbmdsZSA9IHZlYzIuYW5nbGVUbyh2U3RhcnQsIHZQb2ludCwgeC5lbmQgPCB4LnN0YXJ0KTtcbiAgICBpZiAoaXNOdW1iZXJFcXVhbChhbmdsZSwgTWF0aC5QSSAqIDIpKSB7XG4gICAgICBhbmdsZSA9IDA7XG4gICAgfVxuICAgIGNvbnN0IHJhZGl1cyA9IHZlYzIubGVuZ3RoKHZQb2ludCk7XG5cbiAgICBsZXQgeFBlcmNlbnQgPSBhbmdsZSAvICh4LmVuZCAtIHguc3RhcnQpO1xuICAgIHhQZXJjZW50ID0geC5lbmQgLSB4LnN0YXJ0ID4gMCA/IHhQZXJjZW50IDogLXhQZXJjZW50O1xuXG4gICAgY29uc3QgeVBlcmNlbnQgPSB0aGlzLmludmVydERpbShyYWRpdXMsICd5Jyk7XG4gICAgY29uc3QgcnN0ID0ge307XG4gICAgcnN0LnggPSB0aGlzLmlzVHJhbnNwb3NlZCA/IHlQZXJjZW50IDogeFBlcmNlbnQ7XG4gICAgcnN0LnkgPSB0aGlzLmlzVHJhbnNwb3NlZCA/IHhQZXJjZW50IDogeVBlcmNlbnQ7XG4gICAgcmV0dXJuIHJzdDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvbGFyO1xuIl19