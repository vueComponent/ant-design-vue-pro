function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Base = require('./base');

var Shape =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Shape, _Base);

  function Shape(cfg) {
    var _this;

    _this = _Base.call(this, cfg) || this;
    _this.names = ['shape'];
    _this.type = 'shape';
    _this.gradient = null;
    return _this;
  }
  /**
   * @override
   */


  var _proto = Shape.prototype;

  _proto.getLinearValue = function getLinearValue(percent) {
    var values = this.values;
    var index = Math.round((values.length - 1) * percent);
    return values[index];
  };

  return Shape;
}(Base);

module.exports = Shape;