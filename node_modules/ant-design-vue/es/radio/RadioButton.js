import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import Radio from './Radio';
import { getOptionProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'ARadioButton',
  props: _extends({}, Radio.props),
  inject: {
    radioGroupContext: { 'default': undefined },
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        otherProps = _objectWithoutProperties(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    var radioProps = {
      props: _extends({}, otherProps, {
        prefixCls: prefixCls
      }),
      on: getListeners(this)
    };
    if (this.radioGroupContext) {
      radioProps.on.change = this.radioGroupContext.onRadioChange;
      radioProps.props.checked = this.$props.value === this.radioGroupContext.stateValue;
      radioProps.props.disabled = this.$props.disabled || this.radioGroupContext.disabled;
    }
    return h(
      Radio,
      radioProps,
      [this.$slots['default']]
    );
  }
};