function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Adjust = require('./base');

var each = require('@antv/util/lib/each');

var MARGIN_RATIO = 1 / 2;
var DODGE_RATIO = 1 / 2;

var Dodge =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Dodge, _Adjust);

  function Dodge() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Dodge.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    /**
     * 调整过程中,2个数据的间距
     * @type {Number}
     */
    this.marginRatio = MARGIN_RATIO;
    /**
     * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
     * @type {Number}
     */

    this.dodgeRatio = DODGE_RATIO;
    this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
  };

  _proto.getDodgeOffset = function getDodgeOffset(range, index, count) {
    var self = this;
    var pre = range.pre;
    var next = range.next;
    var tickLength = next - pre;
    var width = tickLength * self.dodgeRatio / count;
    var margin = self.marginRatio * width;
    var offset = 1 / 2 * (tickLength - count * width - (count - 1) * margin) + ((index + 1) * width + index * margin) - 1 / 2 * width - 1 / 2 * tickLength;
    return (pre + next) / 2 + offset;
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var count = dataArray.length;
    var xField = self.xField;
    each(dataArray, function (data, index) {
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var value = obj[xField];
        var range = {
          pre: len === 1 ? value - 1 : value - 0.5,
          next: len === 1 ? value + 1 : value + 0.5
        };
        var dodgeValue = self.getDodgeOffset(range, index, count);
        obj[xField] = dodgeValue;
      }
    });
  };

  return Dodge;
}(Adjust);

Adjust.Dodge = Dodge;
module.exports = Dodge;