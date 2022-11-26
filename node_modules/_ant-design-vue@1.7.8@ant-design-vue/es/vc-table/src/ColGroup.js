import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../../_util/vue-types';
import { INTERNAL_COL_DEFINE } from './utils';

export default {
  name: 'ColGroup',
  props: {
    fixed: PropTypes.string,
    columns: PropTypes.array
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } }
  },
  render: function render() {
    var h = arguments[0];
    var fixed = this.fixed,
        table = this.table;
    var prefixCls = table.prefixCls,
        expandIconAsCell = table.expandIconAsCell,
        columnManager = table.columnManager;


    var cols = [];

    if (expandIconAsCell && fixed !== 'right') {
      cols.push(h('col', { 'class': prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
    }

    var leafColumns = void 0;

    if (fixed === 'left') {
      leafColumns = columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      leafColumns = columnManager.rightLeafColumns();
    } else {
      leafColumns = columnManager.leafColumns();
    }
    cols = cols.concat(leafColumns.map(function (_ref) {
      var key = _ref.key,
          dataIndex = _ref.dataIndex,
          width = _ref.width,
          additionalProps = _ref[INTERNAL_COL_DEFINE];

      var mergedKey = key !== undefined ? key : dataIndex;
      var w = typeof width === 'number' ? width + 'px' : width;
      return h('col', _mergeJSXProps([{ key: mergedKey, style: { width: w, minWidth: w } }, additionalProps]));
    }));
    return h('colgroup', [cols]);
  }
};