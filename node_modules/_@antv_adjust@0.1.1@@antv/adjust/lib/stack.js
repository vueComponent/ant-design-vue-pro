function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var isArray = require('@antv/util/lib/type/is-array');

var isNil = require('@antv/util/lib/type/is-nil');

var Adjust = require('./base');

var Stack =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Stack, _Adjust);

  function Stack() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Stack.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    this.processStack(dataArray);
  };

  _proto.processStack = function processStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;
    var count = dataArray.length;
    var stackCache = {
      positive: {},
      negative: {}
    }; // 层叠顺序翻转

    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }

    for (var i = 0; i < count; i++) {
      var data = dataArray[i];

      for (var j = 0, len = data.length; j < len; j++) {
        var item = data[j];
        var x = item[xField] || 0;
        var y = item[yField];
        var xkey = x.toString();
        y = isArray(y) ? y[1] : y;

        if (!isNil(y)) {
          var direction = y >= 0 ? 'positive' : 'negative';

          if (!stackCache[direction][xkey]) {
            stackCache[direction][xkey] = 0;
          }

          item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
          stackCache[direction][xkey] += y;
        }
      }
    }
  };

  return Stack;
}(Adjust);

Adjust.Stack = Stack;
module.exports = Stack;