'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  props: {
    prefixCls: _vueTypes2['default'].string
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    var children = $slots['default'];
    return h(
      'span',
      { 'class': prefixCls + '-separator' },
      [children || '/']
    );
  }
};