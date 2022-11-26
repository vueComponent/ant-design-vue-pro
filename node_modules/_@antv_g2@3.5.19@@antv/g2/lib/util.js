/**
 * @fileOverview The util method based on the lodash.
 * @author dxq613@gmail.com
 * @see https://github.com/lodash/lodash
 */
var Utils = require('@antv/util/lib');

var G = require('./renderer');

var Util = Utils.mix({}, Utils, {
  assign: Utils.mix,
  // simple mix
  merge: Utils.deepMix,
  // deep mix
  cloneDeep: Utils.clone,
  isFinite: isFinite,
  isNaN: isNaN,
  snapEqual: Utils.isNumberEqual,
  remove: Utils.pull,
  inArray: Utils.contains,

  /**
   * 将用户输入的 padding 转换成 [top, right, bottom, right] 的模式
   * @param  {Number|Array} padding 输入的padding
   * @return {Array} 四个padding 值
   */
  toAllPadding: function toAllPadding(padding) {
    var top = 0;
    var left = 0;
    var right = 0;
    var bottom = 0;

    if (Util.isNumber(padding) || Util.isString(padding)) {
      top = left = right = bottom = padding;
    } else if (Util.isArray(padding)) {
      top = padding[0];
      right = !Util.isNil(padding[1]) ? padding[1] : padding[0];
      bottom = !Util.isNil(padding[2]) ? padding[2] : padding[0];
      left = !Util.isNil(padding[3]) ? padding[3] : right;
    } else if (Util.isObject(padding)) {
      top = padding.top || 0;
      right = padding.right || 0;
      bottom = padding.bottom || 0;
      left = padding.left || 0;
    }

    return [top, right, bottom, left];
  },
  getClipByRange: function getClipByRange(plotRange) {
    var tl = plotRange.tl,
        br = plotRange.br;
    var clip = new G.Rect({
      attrs: {
        x: tl.x,
        y: tl.y,
        width: br.x - tl.x,
        height: br.y - tl.y
      }
    });
    return clip;
  }
});
Util.Array = {
  groupToMap: Utils.groupToMap,
  group: Utils.group,
  merge: Utils.merge,
  values: Utils.valuesOfKey,
  getRange: Utils.getRange,
  firstValue: Utils.firstValue,
  remove: Utils.pull
};
module.exports = Util;