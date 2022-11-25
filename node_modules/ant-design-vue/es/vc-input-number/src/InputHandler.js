import PropTypes from '../../_util/vue-types';
import Touchable from '../../vc-m-feedback';
import { getListeners } from '../../_util/props-util';

var InputHandler = {
  name: 'InputHandler',
  props: {
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool
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
      on: getListeners(this)
    };
    return h(
      Touchable,
      touchableProps,
      [h('span', [this.$slots['default']])]
    );
  }
};

export default InputHandler;