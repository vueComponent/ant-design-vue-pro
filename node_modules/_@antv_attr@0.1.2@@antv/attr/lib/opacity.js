function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Base = require('./base');

var Opacity =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Opacity, _Base);

  function Opacity(cfg) {
    var _this;

    _this = _Base.call(this, cfg) || this;
    _this.names = ['opacity'];
    _this.type = 'opacity';
    _this.gradient = null;
    return _this;
  }

  return Opacity;
}(Base);

module.exports = Opacity;