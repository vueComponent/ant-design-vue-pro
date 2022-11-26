'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcMFeedback = require('../../vc-m-feedback');

var _vcMFeedback2 = _interopRequireDefault(_vcMFeedback);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InputHandler = {
  name: 'InputHandler',
  props: {
    prefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        disabled = _$props.disabled;

    var touchableProps = {
      props: {
        disabled: disabled,
        activeClassName: prefixCls + '-handler-active'
      },
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      _vcMFeedback2['default'],
      touchableProps,
      [h('span', [this.$slots['default']])]
    );
  }
};

exports['default'] = InputHandler;