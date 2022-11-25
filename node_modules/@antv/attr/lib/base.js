/**
 * @fileOverview the Attribute base class
 */
var isString = require('@antv/util/lib/type/is-string');

var isArray = require('@antv/util/lib/type/is-array');

var isNil = require('@antv/util/lib/type/is-nil');

var mix = require('@antv/util/lib/mix');

var each = require('@antv/util/lib/each');

function toScaleString(scale, value) {
  if (isString(value)) {
    return value;
  }

  return scale.invert(scale.scale(value));
}
/**
 * 所有视觉通道属性的基类
 * @class Attr
 */


var AttributeBase =
/*#__PURE__*/
function () {
  function AttributeBase(cfg) {
    var _this = this;

    /**
     * 属性的类型
     * @type {String}
     */
    this.type = 'base';
    /**
     * 属性的名称
     * @type {String}
     */

    this.name = null;
    /**
     * 回调函数
     * @type {Function}
     */

    this.method = null;
    /**
     * 备选的值数组
     * @type {Array}
     */

    this.values = [];
    /**
     * 属性内部的度量
     * @type {Array}
     */

    this.scales = [];
    /**
     * 是否通过线性取值, 如果未指定，则根据数值的类型判定
     * @type {Boolean}
     */

    this.linear = null;
    /**
     * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
     */

    var mixedCallback = null;
    var defaultCallback = this.callback;

    if (cfg.callback) {
      var userCallback = cfg.callback;

      mixedCallback = function mixedCallback() {
        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        var ret = userCallback.apply(void 0, params);

        if (isNil(ret)) {
          ret = defaultCallback.apply(_this, params);
        }

        return ret;
      };
    }

    mix(this, cfg);

    if (mixedCallback) {
      mix(this, {
        callback: mixedCallback
      });
    }
  } // 获取属性值，将值映射到视觉通道


  var _proto = AttributeBase.prototype;

  _proto._getAttrValue = function _getAttrValue(scale, value) {
    var values = this.values;

    if (scale.isCategory && !this.linear) {
      var index = scale.translate(value);
      return values[index % values.length];
    }

    var percent = scale.scale(value);
    return this.getLinearValue(percent);
  };
  /**
   * 如果进行线性映射，返回对应的映射值
   * @protected
   * @param  {Number} percent 百分比
   * @return {*}  颜色值、形状、大小等
   */


  _proto.getLinearValue = function getLinearValue(percent) {
    var values = this.values;
    var steps = values.length - 1;
    var step = Math.floor(steps * percent);
    var leftPercent = steps * percent - step;
    var start = values[step];
    var end = step === steps ? start : values[step + 1];
    var rstValue = start + (end - start) * leftPercent;
    return rstValue;
  };
  /**
   * 默认的回调函数
   * @param {*} value 回调函数的值
   * @type {Function}
   * @return {Array} 返回映射后的值
   */


  _proto.callback = function callback(value) {
    var self = this;
    var scale = self.scales[0];
    var rstValue = null;

    if (scale.type === 'identity') {
      rstValue = scale.value;
    } else {
      rstValue = self._getAttrValue(scale, value);
    }

    return rstValue;
  };
  /**
   * 根据度量获取属性名
   * @return {Array} dims of this Attribute
   */


  _proto.getNames = function getNames() {
    var scales = this.scales;
    var names = this.names;
    var length = Math.min(scales.length, names.length);
    var rst = [];

    for (var i = 0; i < length; i++) {
      rst.push(names[i]);
    }

    return rst;
  };
  /**
   * 根据度量获取维度名
   * @return {Array} dims of this Attribute
   */


  _proto.getFields = function getFields() {
    var scales = this.scales;
    var rst = [];
    each(scales, function (scale) {
      rst.push(scale.field);
    });
    return rst;
  };
  /**
   * 根据名称获取度量
   * @param  {String} name the name of scale
   * @return {Scale} scale
   */


  _proto.getScale = function getScale(name) {
    var scales = this.scales;
    var names = this.names;
    var index = names.indexOf(name);
    return scales[index];
  };
  /**
   * 映射数据
   * @param {*} param1...paramn 多个数值
   * @return {Array} 映射的值组成的数组
   */


  _proto.mapping = function mapping() {
    var scales = this.scales;
    var callback = this.callback;

    for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    var values = params;

    if (callback) {
      for (var i = 0, len = params.length; i < len; i++) {
        params[i] = this._toOriginParam(params[i], scales[i]);
      }

      values = callback.apply(this, params);
    }

    values = [].concat(values);
    return values;
  }; // 原始的参数


  _proto._toOriginParam = function _toOriginParam(param, scale) {
    var rst = param;

    if (!scale.isLinear) {
      if (isArray(param)) {
        rst = [];

        for (var i = 0, len = param.length; i < len; i++) {
          rst.push(toScaleString(scale, param[i]));
        }
      } else {
        rst = toScaleString(scale, param);
      }
    }

    return rst;
  };

  return AttributeBase;
}();

module.exports = AttributeBase;