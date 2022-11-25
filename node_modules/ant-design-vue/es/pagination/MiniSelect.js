import _extends from 'babel-runtime/helpers/extends';
import VcSelect, { SelectProps } from '../select';
import { getOptionProps, filterEmpty, getListeners } from '../_util/props-util';

export default {
  props: _extends({}, SelectProps),
  Option: VcSelect.Option,
  render: function render() {
    var h = arguments[0];

    var selectOptionsProps = getOptionProps(this);
    var selelctProps = {
      props: _extends({}, selectOptionsProps, {
        size: 'small'
      }),
      on: getListeners(this)
    };
    return h(
      VcSelect,
      selelctProps,
      [filterEmpty(this.$slots['default'])]
    );
  }
};