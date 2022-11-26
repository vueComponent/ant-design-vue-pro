import Icon from '../icon';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export default {
  functional: true,
  render: function render(h, context) {
    var props = context.props;
    var suffixIcon = props.suffixIcon,
        prefixCls = props.prefixCls;

    return (suffixIcon && isValidElement(suffixIcon) ? cloneElement(suffixIcon, {
      'class': prefixCls + '-picker-icon'
    }) : h(
      'span',
      { 'class': prefixCls + '-picker-icon' },
      [suffixIcon]
    )) || h(Icon, {
      attrs: { type: 'calendar' },
      'class': prefixCls + '-picker-icon' });
  }
};