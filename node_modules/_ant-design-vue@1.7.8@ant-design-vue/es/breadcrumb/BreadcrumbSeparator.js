import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import PropTypes from '../_util/vue-types';

export default {
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  props: {
    prefixCls: PropTypes.string
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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