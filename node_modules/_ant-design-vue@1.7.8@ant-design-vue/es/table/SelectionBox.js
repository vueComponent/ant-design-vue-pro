import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import Checkbox from '../checkbox';
import Radio from '../radio';
import { SelectionBoxProps } from './interface';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, getListeners } from '../_util/props-util';

export default {
  name: 'SelectionBox',
  mixins: [BaseMixin],
  props: SelectionBoxProps,
  computed: {
    checked: function checked() {
      var _$props = this.$props,
          store = _$props.store,
          defaultSelection = _$props.defaultSelection,
          rowIndex = _$props.rowIndex;

      var checked = false;
      if (store.selectionDirty) {
        checked = store.selectedRowKeys.indexOf(rowIndex) >= 0;
      } else {
        checked = store.selectedRowKeys.indexOf(rowIndex) >= 0 || defaultSelection.indexOf(rowIndex) >= 0;
      }
      return checked;
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        type = _getOptionProps.type,
        rowIndex = _getOptionProps.rowIndex,
        rest = _objectWithoutProperties(_getOptionProps, ['type', 'rowIndex']);

    var checked = this.checked;

    var checkboxProps = {
      props: _extends({
        checked: checked
      }, rest),
      on: getListeners(this)
    };
    if (type === 'radio') {
      checkboxProps.props.value = rowIndex;
      return h(Radio, checkboxProps);
    }
    return h(Checkbox, checkboxProps);
  }
};