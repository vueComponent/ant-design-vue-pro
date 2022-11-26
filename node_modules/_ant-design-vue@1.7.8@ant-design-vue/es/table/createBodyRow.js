import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { getListeners } from '../_util/props-util';

var BodyRowProps = {
  store: PropTypes.any,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string
};

export default function createBodyRow() {
  var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tr';

  var BodyRow = {
    name: 'BodyRow',
    props: BodyRowProps,
    computed: {
      selected: function selected() {
        return this.$props.store.selectedRowKeys.indexOf(this.$props.rowKey) >= 0;
      }
    },
    render: function render() {
      var h = arguments[0];

      var className = _defineProperty({}, this.prefixCls + '-row-selected', this.selected);

      return h(
        Component,
        _mergeJSXProps([{ 'class': className }, { on: getListeners(this) }]),
        [this.$slots['default']]
      );
    }
  };

  return BodyRow;
}