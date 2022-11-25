import _defineProperty from 'babel-runtime/helpers/defineProperty';
import { filterEmpty } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

var ButtonGroupProps = {
  prefixCls: PropTypes.string,
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  }
};
export { ButtonGroupProps };
export default {
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      }
    };
  },
  render: function render() {
    var _classes;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        size = this.size,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('btn-group', customizePrefixCls);

    // large => lg
    // small => sm
    var sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    var classes = (_classes = {}, _defineProperty(_classes, '' + prefixCls, true), _defineProperty(_classes, prefixCls + '-' + sizeCls, sizeCls), _classes);
    return h(
      'div',
      { 'class': classes },
      [filterEmpty($slots['default'])]
    );
  }
};