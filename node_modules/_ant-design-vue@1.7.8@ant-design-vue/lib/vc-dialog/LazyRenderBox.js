'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ILazyRenderBoxPropTypes = {
  visible: _vueTypes2['default'].bool,
  hiddenClassName: _vueTypes2['default'].string,
  forceRender: _vueTypes2['default'].bool
};

exports['default'] = {
  props: ILazyRenderBoxPropTypes,
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { on: (0, _propsUtil.getListeners)(this) },
      [this.$slots['default']]
    );
  }
};