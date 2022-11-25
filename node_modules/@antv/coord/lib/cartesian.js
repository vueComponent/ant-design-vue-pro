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
 * @fileOverview the class of Cartesian Coordinate
 * @author sima.zhang
 */
var mix = require('@antv/util/lib/mix');

var Base = require('./base');

var Cartesian =
/*#__PURE__*/
function (_Base) {
  _inherits(Cartesian, _Base);

  _createClass(Cartesian, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Cartesian.prototype), "getDefaultCfg", this).call(this);

      return mix({}, cfg, {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 0
        },
        type: 'cartesian',
        isRect: true
      });
    }
  }]);

  function Cartesian(cfg) {
    var _this;

    _classCallCheck(this, Cartesian);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Cartesian).call(this, cfg));

    _this._init();

    return _this;
  }

  _createClass(Cartesian, [{
    key: "_init",
    value: function _init() {
      var start = this.start,
          end = this.end;
      var x = {
        start: start.x,
        end: end.x
      };
      var y = {
        start: start.y,
        end: end.y
      };
      this.x = x;
      this.y = y;
    }
  }, {
    key: "convertPoint",
    value: function convertPoint(point) {
      var x;
      var y;

      if (this.isTransposed) {
        x = point.y;
        y = point.x;
      } else {
        x = point.x;
        y = point.y;
      }

      return {
        x: this.convertDim(x, 'x'),
        y: this.convertDim(y, 'y')
      };
    }
  }, {
    key: "invertPoint",
    value: function invertPoint(point) {
      var x = this.invertDim(point.x, 'x');
      var y = this.invertDim(point.y, 'y');

      if (this.isTransposed) {
        return {
          x: y,
          y: x
        };
      }

      return {
        x: x,
        y: y
      };
    }
  }]);

  return Cartesian;
}(Base);

module.exports = Cartesian;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jYXJ0ZXNpYW4uanMiXSwibmFtZXMiOlsibWl4IiwicmVxdWlyZSIsIkJhc2UiLCJDYXJ0ZXNpYW4iLCJjZmciLCJzdGFydCIsIngiLCJ5IiwiZW5kIiwidHlwZSIsImlzUmVjdCIsIl9pbml0IiwicG9pbnQiLCJpc1RyYW5zcG9zZWQiLCJjb252ZXJ0RGltIiwiaW52ZXJ0RGltIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQSxJQUFNQSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxvQkFBRCxDQUFuQjs7QUFDQSxJQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxRQUFELENBQXBCOztJQUVNRSxTOzs7Ozs7OztBQUVKOzs7b0NBR2dCO0FBQ2QsVUFBTUMsR0FBRywrRUFBVDs7QUFDQSxhQUFPSixHQUFHLENBQUMsRUFBRCxFQUFLSSxHQUFMLEVBQVU7QUFDbEJDLFFBQUFBLEtBQUssRUFBRTtBQUNMQyxVQUFBQSxDQUFDLEVBQUUsQ0FERTtBQUVMQyxVQUFBQSxDQUFDLEVBQUU7QUFGRSxTQURXO0FBS2xCQyxRQUFBQSxHQUFHLEVBQUU7QUFDSEYsVUFBQUEsQ0FBQyxFQUFFLENBREE7QUFFSEMsVUFBQUEsQ0FBQyxFQUFFO0FBRkEsU0FMYTtBQVNsQkUsUUFBQUEsSUFBSSxFQUFFLFdBVFk7QUFVbEJDLFFBQUFBLE1BQU0sRUFBRTtBQVZVLE9BQVYsQ0FBVjtBQVlEOzs7QUFFRCxxQkFBWU4sR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUNmLG1GQUFNQSxHQUFOOztBQUNBLFVBQUtPLEtBQUw7O0FBRmU7QUFHaEI7Ozs7NEJBRU87QUFBQSxVQUNFTixLQURGLEdBQ2lCLElBRGpCLENBQ0VBLEtBREY7QUFBQSxVQUNTRyxHQURULEdBQ2lCLElBRGpCLENBQ1NBLEdBRFQ7QUFFTixVQUFNRixDQUFDLEdBQUc7QUFDUkQsUUFBQUEsS0FBSyxFQUFFQSxLQUFLLENBQUNDLENBREw7QUFFUkUsUUFBQUEsR0FBRyxFQUFFQSxHQUFHLENBQUNGO0FBRkQsT0FBVjtBQUlBLFVBQU1DLENBQUMsR0FBRztBQUNSRixRQUFBQSxLQUFLLEVBQUVBLEtBQUssQ0FBQ0UsQ0FETDtBQUVSQyxRQUFBQSxHQUFHLEVBQUVBLEdBQUcsQ0FBQ0Q7QUFGRCxPQUFWO0FBSUEsV0FBS0QsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsV0FBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0Q7OztpQ0FFWUssSyxFQUFPO0FBQ2xCLFVBQUlOLENBQUo7QUFDQSxVQUFJQyxDQUFKOztBQUNBLFVBQUksS0FBS00sWUFBVCxFQUF1QjtBQUNyQlAsUUFBQUEsQ0FBQyxHQUFHTSxLQUFLLENBQUNMLENBQVY7QUFDQUEsUUFBQUEsQ0FBQyxHQUFHSyxLQUFLLENBQUNOLENBQVY7QUFDRCxPQUhELE1BR087QUFDTEEsUUFBQUEsQ0FBQyxHQUFHTSxLQUFLLENBQUNOLENBQVY7QUFDQUMsUUFBQUEsQ0FBQyxHQUFHSyxLQUFLLENBQUNMLENBQVY7QUFDRDs7QUFFRCxhQUFPO0FBQ0xELFFBQUFBLENBQUMsRUFBRSxLQUFLUSxVQUFMLENBQWdCUixDQUFoQixFQUFtQixHQUFuQixDQURFO0FBRUxDLFFBQUFBLENBQUMsRUFBRSxLQUFLTyxVQUFMLENBQWdCUCxDQUFoQixFQUFtQixHQUFuQjtBQUZFLE9BQVA7QUFJRDs7O2dDQUVXSyxLLEVBQU87QUFDakIsVUFBTU4sQ0FBQyxHQUFHLEtBQUtTLFNBQUwsQ0FBZUgsS0FBSyxDQUFDTixDQUFyQixFQUF3QixHQUF4QixDQUFWO0FBQ0EsVUFBTUMsQ0FBQyxHQUFHLEtBQUtRLFNBQUwsQ0FBZUgsS0FBSyxDQUFDTCxDQUFyQixFQUF3QixHQUF4QixDQUFWOztBQUVBLFVBQUksS0FBS00sWUFBVCxFQUF1QjtBQUNyQixlQUFPO0FBQ0xQLFVBQUFBLENBQUMsRUFBRUMsQ0FERTtBQUVMQSxVQUFBQSxDQUFDLEVBQUVEO0FBRkUsU0FBUDtBQUlEOztBQUVELGFBQU87QUFDTEEsUUFBQUEsQ0FBQyxFQUFEQSxDQURLO0FBRUxDLFFBQUFBLENBQUMsRUFBREE7QUFGSyxPQUFQO0FBSUQ7Ozs7RUF4RXFCTCxJOztBQTJFeEJjLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmQsU0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgdGhlIGNsYXNzIG9mIENhcnRlc2lhbiBDb29yZGluYXRlXG4gKiBAYXV0aG9yIHNpbWEuemhhbmdcbiAqL1xuY29uc3QgbWl4ID0gcmVxdWlyZSgnQGFudHYvdXRpbC9saWIvbWl4Jyk7XG5jb25zdCBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNsYXNzIENhcnRlc2lhbiBleHRlbmRzIEJhc2Uge1xuXG4gIC8qKlxuICAgKiBAb3ZlcnJpZGVcbiAgICovXG4gIGdldERlZmF1bHRDZmcoKSB7XG4gICAgY29uc3QgY2ZnID0gc3VwZXIuZ2V0RGVmYXVsdENmZygpO1xuICAgIHJldHVybiBtaXgoe30sIGNmZywge1xuICAgICAgc3RhcnQ6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIGVuZDoge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9LFxuICAgICAgdHlwZTogJ2NhcnRlc2lhbicsXG4gICAgICBpc1JlY3Q6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGNmZykge1xuICAgIHN1cGVyKGNmZyk7XG4gICAgdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgX2luaXQoKSB7XG4gICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzO1xuICAgIGNvbnN0IHggPSB7XG4gICAgICBzdGFydDogc3RhcnQueCxcbiAgICAgIGVuZDogZW5kLnhcbiAgICB9O1xuICAgIGNvbnN0IHkgPSB7XG4gICAgICBzdGFydDogc3RhcnQueSxcbiAgICAgIGVuZDogZW5kLnlcbiAgICB9O1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIGNvbnZlcnRQb2ludChwb2ludCkge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIGlmICh0aGlzLmlzVHJhbnNwb3NlZCkge1xuICAgICAgeCA9IHBvaW50Lnk7XG4gICAgICB5ID0gcG9pbnQueDtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHBvaW50Lng7XG4gICAgICB5ID0gcG9pbnQueTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogdGhpcy5jb252ZXJ0RGltKHgsICd4JyksXG4gICAgICB5OiB0aGlzLmNvbnZlcnREaW0oeSwgJ3knKVxuICAgIH07XG4gIH1cblxuICBpbnZlcnRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IHggPSB0aGlzLmludmVydERpbShwb2ludC54LCAneCcpO1xuICAgIGNvbnN0IHkgPSB0aGlzLmludmVydERpbShwb2ludC55LCAneScpO1xuXG4gICAgaWYgKHRoaXMuaXNUcmFuc3Bvc2VkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB5LFxuICAgICAgICB5OiB4XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeVxuICAgIH07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXJ0ZXNpYW47XG4iXX0=