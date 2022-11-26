'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ColGroup',
  props: {
    fixed: _vueTypes2['default'].string,
    columns: _vueTypes2['default'].array
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
          additionalProps = _ref[_utils.INTERNAL_COL_DEFINE];

      var mergedKey = key !== undefined ? key : dataIndex;
      var w = typeof width === 'number' ? width + 'px' : width;
      return h('col', (0, _babelHelperVueJsxMergeProps2['default'])([{ key: mergedKey, style: { width: w, minWidth: w } }, additionalProps]));
    }));
    return h('colgroup', [cols]);
  }
};