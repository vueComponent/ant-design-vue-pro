"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @fileOverview the base class of Coordinate
 * @author sima.zhang
 */
var MatrixUtil = require('@antv/util/lib/matrix/');

var mix = require('@antv/util/lib/mix');

var mat3 = MatrixUtil.mat3;
var vec3 = MatrixUtil.vec3;

var Coord =
/*#__PURE__*/
function () {
  _createClass(Coord, [{
    key: "getDefaultCfg",

    /**
     * 获取默认的配置属性
     * @protected
     * @return {Object} 默认属性
     */
    value: function getDefaultCfg() {
      return {
        /**
         * Mark x y is transposed.
         * @type {Boolean}
         */
        isTransposed: false,

        /**
         * The matrix of coordinate
         * @type {Array}
         */
        matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1]
      };
    }
  }]);

  function Coord(cfg) {
    _classCallCheck(this, Coord);

    var defaultCfg = this.getDefaultCfg();
    mix(this, defaultCfg, cfg);
    this.init();
  }

  _createClass(Coord, [{
    key: "init",
    value: function init() {
      var start = this.start;
      var end = this.end;
      var center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };
      this.center = center;
      this.width = Math.abs(end.x - start.x);
      this.height = Math.abs(end.y - start.y);
    }
  }, {
    key: "_swapDim",
    value: function _swapDim(dim) {
      var dimRange = this[dim];

      if (dimRange) {
        var tmp = dimRange.start;
        dimRange.start = dimRange.end;
        dimRange.end = tmp;
      }
    }
  }, {
    key: "getCenter",
    value: function getCenter() {
      return this.center;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.height;
    }
  }, {
    key: "convertDim",
    value: function convertDim(percent, dim) {
      var _this$dim = this[dim],
          start = _this$dim.start,
          end = _this$dim.end;
      return start + percent * (end - start);
    }
  }, {
    key: "invertDim",
    value: function invertDim(value, dim) {
      var _this$dim2 = this[dim],
          start = _this$dim2.start,
          end = _this$dim2.end;
      return (value - start) / (end - start);
    }
    /**
     * 将归一化的坐标点数据转换为画布坐标
     * @override
     * @param  {Object} point 归一化的坐标点
     * @return {Object}       返回画布坐标
     */

  }, {
    key: "convertPoint",
    value: function convertPoint(point) {
      return point;
    }
    /**
     * 将画布坐标转换为归一化的坐标点数据
     * @override
     * @param  {Object} point 画布坐标点数据
     * @return {Object}       归一化后的数据点
     */

  }, {
    key: "invertPoint",
    value: function invertPoint(point) {
      return point;
    }
    /**
     * 将坐标点进行矩阵变换
     * @param  {Number} x   对应 x 轴画布坐标
     * @param  {Number} y   对应 y 轴画布坐标
     * @param  {Number} tag 默认为 0，可取值 0, 1
     * @return {Array}     返回变换后的三阶向量 [x, y, z]
     */

  }, {
    key: "applyMatrix",
    value: function applyMatrix(x, y) {
      var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var matrix = this.matrix;
      var vector = [x, y, tag];
      vec3.transformMat3(vector, vector, matrix);
      return vector;
    }
    /**
     * 将坐标点进行矩阵逆变换
     * @param  {Number} x   对应 x 轴画布坐标
     * @param  {Number} y   对应 y 轴画布坐标
     * @param  {Number} tag 默认为 0，可取值 0, 1
     * @return {Array}     返回矩阵逆变换后的三阶向量 [x, y, z]
     */

  }, {
    key: "invertMatrix",
    value: function invertMatrix(x, y) {
      var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var matrix = this.matrix;
      var inversedMatrix = mat3.invert([], matrix);
      var vector = [x, y, tag];
      vec3.transformMat3(vector, vector, inversedMatrix);
      return vector;
    }
    /**
     * 将归一化的坐标点数据转换为画布坐标，并根据坐标系当前矩阵进行变换
     * @param  {Object} point 归一化的坐标点
     * @return {Object}       返回进行矩阵变换后的画布坐标
     */

  }, {
    key: "convert",
    value: function convert(point) {
      var _this$convertPoint = this.convertPoint(point),
          x = _this$convertPoint.x,
          y = _this$convertPoint.y;

      var vector = this.applyMatrix(x, y, 1);
      return {
        x: vector[0],
        y: vector[1]
      };
    }
    /**
     * 将进行过矩阵变换画布坐标转换为归一化坐标
     * @param  {Object} point 画布坐标
     * @return {Object}       返回归一化的坐标点
     */

  }, {
    key: "invert",
    value: function invert(point) {
      var vector = this.invertMatrix(point.x, point.y, 1);
      return this.invertPoint({
        x: vector[0],
        y: vector[1]
      });
    }
    /**
     * 坐标系旋转变换
     * @param  {Number} radian 旋转弧度
     * @return {Object}        返回坐标系对象
     */

  }, {
    key: "rotate",
    value: function rotate(radian) {
      var matrix = this.matrix;
      var center = this.center;
      mat3.translate(matrix, matrix, [-center.x, -center.y]);
      mat3.rotate(matrix, matrix, radian);
      mat3.translate(matrix, matrix, [center.x, center.y]);
      return this;
    }
    /**
     * 坐标系反射变换
     * @param  {String} dim 反射维度
     * @return {Object}     返回坐标系对象
     */

  }, {
    key: "reflect",
    value: function reflect(dim) {
      switch (dim) {
        case 'x':
          this._swapDim('x');

          break;

        case 'y':
          this._swapDim('y');

          break;

        default:
          this._swapDim('y');

      }

      return this;
    }
    /**
     * 坐标系比例变换
     * @param  {Number} s1 x 方向缩放比例
     * @param  {Number} s2 y 方向缩放比例
     * @return {Object}    返回坐标系对象
     */

  }, {
    key: "scale",
    value: function scale(s1, s2) {
      var matrix = this.matrix;
      var center = this.center;
      mat3.translate(matrix, matrix, [-center.x, -center.y]);
      mat3.scale(matrix, matrix, [s1, s2]);
      mat3.translate(matrix, matrix, [center.x, center.y]);
      return this;
    }
    /**
     * 坐标系平移变换
     * @param  {Number} x x 方向平移像素
     * @param  {Number} y y 方向平移像素
     * @return {Object}   返回坐标系对象
     */

  }, {
    key: "translate",
    value: function translate(x, y) {
      var matrix = this.matrix;
      mat3.translate(matrix, matrix, [x, y]);
      return this;
    }
    /**
     * 将坐标系 x y 两个轴进行转置
     * @return {Object} 返回坐标系对象
     */

  }, {
    key: "transpose",
    value: function transpose() {
      this.isTransposed = !this.isTransposed;
      return this;
    }
  }]);

  return Coord;
}();

module.exports = Coord;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXNlLmpzIl0sIm5hbWVzIjpbIk1hdHJpeFV0aWwiLCJyZXF1aXJlIiwibWl4IiwibWF0MyIsInZlYzMiLCJDb29yZCIsImlzVHJhbnNwb3NlZCIsIm1hdHJpeCIsImNmZyIsImRlZmF1bHRDZmciLCJnZXREZWZhdWx0Q2ZnIiwiaW5pdCIsInN0YXJ0IiwiZW5kIiwiY2VudGVyIiwieCIsInkiLCJ3aWR0aCIsIk1hdGgiLCJhYnMiLCJoZWlnaHQiLCJkaW0iLCJkaW1SYW5nZSIsInRtcCIsInBlcmNlbnQiLCJ2YWx1ZSIsInBvaW50IiwidGFnIiwidmVjdG9yIiwidHJhbnNmb3JtTWF0MyIsImludmVyc2VkTWF0cml4IiwiaW52ZXJ0IiwiY29udmVydFBvaW50IiwiYXBwbHlNYXRyaXgiLCJpbnZlcnRNYXRyaXgiLCJpbnZlcnRQb2ludCIsInJhZGlhbiIsInRyYW5zbGF0ZSIsInJvdGF0ZSIsIl9zd2FwRGltIiwiczEiLCJzMiIsInNjYWxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLHdCQUFELENBQTFCOztBQUNBLElBQU1DLEdBQUcsR0FBR0QsT0FBTyxDQUFDLG9CQUFELENBQW5COztBQUVBLElBQU1FLElBQUksR0FBR0gsVUFBVSxDQUFDRyxJQUF4QjtBQUNBLElBQU1DLElBQUksR0FBR0osVUFBVSxDQUFDSSxJQUF4Qjs7SUFFTUMsSzs7Ozs7O0FBQ0o7Ozs7O29DQUtnQjtBQUNkLGFBQU87QUFDTDs7OztBQUlBQyxRQUFBQSxZQUFZLEVBQUUsS0FMVDs7QUFNTDs7OztBQUlBQyxRQUFBQSxNQUFNLEVBQUUsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQixDQUExQjtBQVZILE9BQVA7QUFZRDs7O0FBRUQsaUJBQVlD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cEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDa0MsU0FBTCxDQUFlOUIsTUFBZixFQUF1QkEsTUFBdkIsRUFBK0IsQ0FBRVEsQ0FBRixFQUFLQyxDQUFMLENBQS9CO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFFRDs7Ozs7OztnQ0FJWTtBQUNWLFdBQUtWLFlBQUwsR0FBb0IsQ0FBQyxLQUFLQSxZQUExQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7QUFHSHFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZDLEtBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IHRoZSBiYXNlIGNsYXNzIG9mIENvb3JkaW5hdGVcbiAqIEBhdXRob3Igc2ltYS56aGFuZ1xuICovXG5jb25zdCBNYXRyaXhVdGlsID0gcmVxdWlyZSgnQGFudHYvdXRpbC9saWIvbWF0cml4LycpO1xuY29uc3QgbWl4ID0gcmVxdWlyZSgnQGFudHYvdXRpbC9saWIvbWl4Jyk7XG5cbmNvbnN0IG1hdDMgPSBNYXRyaXhVdGlsLm1hdDM7XG5jb25zdCB2ZWMzID0gTWF0cml4VXRpbC52ZWMzO1xuXG5jbGFzcyBDb29yZCB7XG4gIC8qKlxuICAgKiDojrflj5bpu5jorqTnmoTphY3nva7lsZ7mgKdcbiAgICogQHByb3RlY3RlZFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IOm7mOiupOWxnuaAp1xuICAgKi9cbiAgZ2V0RGVmYXVsdENmZygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBNYXJrIHggeSBpcyB0cmFuc3Bvc2VkLlxuICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIGlzVHJhbnNwb3NlZDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtYXRyaXggb2YgY29vcmRpbmF0ZVxuICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICovXG4gICAgICBtYXRyaXg6IFsgMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMSBdXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGNmZykge1xuICAgIGNvbnN0IGRlZmF1bHRDZmcgPSB0aGlzLmdldERlZmF1bHRDZmcoKTtcbiAgICBtaXgodGhpcywgZGVmYXVsdENmZywgY2ZnKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuZW5kO1xuICAgIGNvbnN0IGNlbnRlciA9IHtcbiAgICAgIHg6IChzdGFydC54ICsgZW5kLngpIC8gMixcbiAgICAgIHk6IChzdGFydC55ICsgZW5kLnkpIC8gMlxuICAgIH07XG5cbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLndpZHRoID0gTWF0aC5hYnMoZW5kLnggLSBzdGFydC54KTtcbiAgICB0aGlzLmhlaWdodCA9IE1hdGguYWJzKGVuZC55IC0gc3RhcnQueSk7XG4gIH1cblxuICBfc3dhcERpbShkaW0pIHtcbiAgICBjb25zdCBkaW1SYW5nZSA9IHRoaXNbZGltXTtcbiAgICBpZiAoZGltUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHRtcCA9IGRpbVJhbmdlLnN0YXJ0O1xuICAgICAgZGltUmFuZ2Uuc3RhcnQgPSBkaW1SYW5nZS5lbmQ7XG4gICAgICBkaW1SYW5nZS5lbmQgPSB0bXA7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q2VudGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNlbnRlcjtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9XG5cbiAgZ2V0SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIGNvbnZlcnREaW0ocGVyY2VudCwgZGltKSB7XG4gICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzW2RpbV07XG4gICAgcmV0dXJuIHN0YXJ0ICsgcGVyY2VudCAqIChlbmQgLSBzdGFydCk7XG4gIH1cblxuICBpbnZlcnREaW0odmFsdWUsIGRpbSkge1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpc1tkaW1dO1xuICAgIHJldHVybiAodmFsdWUgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuW9kuS4gOWMlueahOWdkOagh+eCueaVsOaNrui9rOaNouS4uueUu+W4g+WdkOagh1xuICAgKiBAb3ZlcnJpZGVcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwb2ludCDlvZLkuIDljJbnmoTlnZDmoIfngrlcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICDov5Tlm57nlLvluIPlnZDmoIdcbiAgICovXG4gIGNvbnZlcnRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbnlLvluIPlnZDmoIfovazmjaLkuLrlvZLkuIDljJbnmoTlnZDmoIfngrnmlbDmja5cbiAgICogQG92ZXJyaWRlXG4gICAqIEBwYXJhbSAge09iamVjdH0gcG9pbnQg55S75biD5Z2Q5qCH54K55pWw5o2uXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAg5b2S5LiA5YyW5ZCO55qE5pWw5o2u54K5XG4gICAqL1xuICBpbnZlcnRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIblnZDmoIfngrnov5vooYznn6npmLXlj5jmjaJcbiAgICogQHBhcmFtICB7TnVtYmVyfSB4ICAg5a+55bqUIHgg6L2055S75biD5Z2Q5qCHXG4gICAqIEBwYXJhbSAge051bWJlcn0geSAgIOWvueW6lCB5IOi9tOeUu+W4g+WdkOagh1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHRhZyDpu5jorqTkuLogMO+8jOWPr+WPluWAvCAwLCAxXG4gICAqIEByZXR1cm4ge0FycmF5fSAgICAg6L+U5Zue5Y+Y5o2i5ZCO55qE5LiJ6Zi25ZCR6YePIFt4LCB5LCB6XVxuICAgKi9cbiAgYXBwbHlNYXRyaXgoeCwgeSwgdGFnID0gMCkge1xuICAgIGNvbnN0IG1hdHJpeCA9IHRoaXMubWF0cml4O1xuICAgIGNvbnN0IHZlY3RvciA9IFsgeCwgeSwgdGFnIF07XG4gICAgdmVjMy50cmFuc2Zvcm1NYXQzKHZlY3RvciwgdmVjdG9yLCBtYXRyaXgpO1xuICAgIHJldHVybiB2ZWN0b3I7XG4gIH1cblxuICAvKipcbiAgICog5bCG5Z2Q5qCH54K56L+b6KGM55+p6Zi16YCG5Y+Y5o2iXG4gICAqIEBwYXJhbSAge051bWJlcn0geCAgIOWvueW6lCB4IOi9tOeUu+W4g+WdkOagh1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHkgICDlr7nlupQgeSDovbTnlLvluIPlnZDmoIdcbiAgICogQHBhcmFtICB7TnVtYmVyfSB0YWcg6buY6K6k5Li6IDDvvIzlj6/lj5blgLwgMCwgMVxuICAgKiBAcmV0dXJuIHtBcnJheX0gICAgIOi/lOWbnuefqemYtemAhuWPmOaNouWQjueahOS4iemYtuWQkemHjyBbeCwgeSwgel1cbiAgICovXG4gIGludmVydE1hdHJpeCh4LCB5LCB0YWcgPSAwKSB7XG4gICAgY29uc3QgbWF0cml4ID0gdGhpcy5tYXRyaXg7XG4gICAgY29uc3QgaW52ZXJzZWRNYXRyaXggPSBtYXQzLmludmVydChbXSwgbWF0cml4KTtcbiAgICBjb25zdCB2ZWN0b3IgPSBbIHgsIHksIHRhZyBdO1xuICAgIHZlYzMudHJhbnNmb3JtTWF0Myh2ZWN0b3IsIHZlY3RvciwgaW52ZXJzZWRNYXRyaXgpO1xuICAgIHJldHVybiB2ZWN0b3I7XG4gIH1cblxuICAvKipcbiAgICog5bCG5b2S5LiA5YyW55qE5Z2Q5qCH54K55pWw5o2u6L2s5o2i5Li655S75biD5Z2Q5qCH77yM5bm25qC55o2u5Z2Q5qCH57O75b2T5YmN55+p6Zi16L+b6KGM5Y+Y5o2iXG4gICAqIEBwYXJhbSAge09iamVjdH0gcG9pbnQg5b2S5LiA5YyW55qE5Z2Q5qCH54K5XG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAg6L+U5Zue6L+b6KGM55+p6Zi15Y+Y5o2i5ZCO55qE55S75biD5Z2Q5qCHXG4gICAqL1xuICBjb252ZXJ0KHBvaW50KSB7XG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmNvbnZlcnRQb2ludChwb2ludCk7XG4gICAgY29uc3QgdmVjdG9yID0gdGhpcy5hcHBseU1hdHJpeCh4LCB5LCAxKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogdmVjdG9yWzBdLFxuICAgICAgeTogdmVjdG9yWzFdXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbov5vooYzov4fnn6npmLXlj5jmjaLnlLvluIPlnZDmoIfovazmjaLkuLrlvZLkuIDljJblnZDmoIdcbiAgICogQHBhcmFtICB7T2JqZWN0fSBwb2ludCDnlLvluIPlnZDmoIdcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICDov5Tlm57lvZLkuIDljJbnmoTlnZDmoIfngrlcbiAgICovXG4gIGludmVydChwb2ludCkge1xuICAgIGNvbnN0IHZlY3RvciA9IHRoaXMuaW52ZXJ0TWF0cml4KHBvaW50LngsIHBvaW50LnksIDEpO1xuICAgIHJldHVybiB0aGlzLmludmVydFBvaW50KHtcbiAgICAgIHg6IHZlY3RvclswXSxcbiAgICAgIHk6IHZlY3RvclsxXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWdkOagh+ezu+aXi+i9rOWPmOaNolxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHJhZGlhbiDml4vovazlvKfluqZcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAg6L+U5Zue5Z2Q5qCH57O75a+56LGhXG4gICAqL1xuICByb3RhdGUocmFkaWFuKSB7XG4gICAgY29uc3QgbWF0cml4ID0gdGhpcy5tYXRyaXg7XG4gICAgY29uc3QgY2VudGVyID0gdGhpcy5jZW50ZXI7XG4gICAgbWF0My50cmFuc2xhdGUobWF0cml4LCBtYXRyaXgsIFsgLWNlbnRlci54LCAtY2VudGVyLnkgXSk7XG4gICAgbWF0My5yb3RhdGUobWF0cml4LCBtYXRyaXgsIHJhZGlhbik7XG4gICAgbWF0My50cmFuc2xhdGUobWF0cml4LCBtYXRyaXgsIFsgY2VudGVyLngsIGNlbnRlci55IF0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOWdkOagh+ezu+WPjeWwhOWPmOaNolxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGRpbSDlj43lsITnu7TluqZcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAg6L+U5Zue5Z2Q5qCH57O75a+56LGhXG4gICAqL1xuICByZWZsZWN0KGRpbSkge1xuICAgIHN3aXRjaCAoZGltKSB7XG4gICAgICBjYXNlICd4JzpcbiAgICAgICAgdGhpcy5fc3dhcERpbSgneCcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgICB0aGlzLl9zd2FwRGltKCd5Jyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fc3dhcERpbSgneScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDlnZDmoIfns7vmr5Tkvovlj5jmjaJcbiAgICogQHBhcmFtICB7TnVtYmVyfSBzMSB4IOaWueWQkee8qeaUvuavlOS+i1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHMyIHkg5pa55ZCR57yp5pS+5q+U5L6LXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAg6L+U5Zue5Z2Q5qCH57O75a+56LGhXG4gICAqL1xuICBzY2FsZShzMSwgczIpIHtcbiAgICBjb25zdCBtYXRyaXggPSB0aGlzLm1hdHJpeDtcbiAgICBjb25zdCBjZW50ZXIgPSB0aGlzLmNlbnRlcjtcbiAgICBtYXQzLnRyYW5zbGF0ZShtYXRyaXgsIG1hdHJpeCwgWyAtY2VudGVyLngsIC1jZW50ZXIueSBdKTtcbiAgICBtYXQzLnNjYWxlKG1hdHJpeCwgbWF0cml4LCBbIHMxLCBzMiBdKTtcbiAgICBtYXQzLnRyYW5zbGF0ZShtYXRyaXgsIG1hdHJpeCwgWyBjZW50ZXIueCwgY2VudGVyLnkgXSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5Z2Q5qCH57O75bmz56e75Y+Y5o2iXG4gICAqIEBwYXJhbSAge051bWJlcn0geCB4IOaWueWQkeW5s+enu+WDj+e0oFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHkgeSDmlrnlkJHlubPnp7vlg4/ntKBcbiAgICogQHJldHVybiB7T2JqZWN0fSAgIOi/lOWbnuWdkOagh+ezu+WvueixoVxuICAgKi9cbiAgdHJhbnNsYXRlKHgsIHkpIHtcbiAgICBjb25zdCBtYXRyaXggPSB0aGlzLm1hdHJpeDtcbiAgICBtYXQzLnRyYW5zbGF0ZShtYXRyaXgsIG1hdHJpeCwgWyB4LCB5IF0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuWdkOagh+ezuyB4IHkg5Lik5Liq6L206L+b6KGM6L2s572uXG4gICAqIEByZXR1cm4ge09iamVjdH0g6L+U5Zue5Z2Q5qCH57O75a+56LGhXG4gICAqL1xuICB0cmFuc3Bvc2UoKSB7XG4gICAgdGhpcy5pc1RyYW5zcG9zZWQgPSAhdGhpcy5pc1RyYW5zcG9zZWQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb29yZDtcbiJdfQ==