'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandableTableProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _utils = require('./utils');

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ExpandableTableProps = exports.ExpandableTableProps = function ExpandableTableProps() {
  return {
    expandIconAsCell: _vueTypes2['default'].bool,
    expandRowByClick: _vueTypes2['default'].bool,
    expandedRowKeys: _vueTypes2['default'].array,
    expandedRowClassName: _vueTypes2['default'].func,
    defaultExpandAllRows: _vueTypes2['default'].bool,
    defaultExpandedRowKeys: _vueTypes2['default'].array,
    expandIconColumnIndex: _vueTypes2['default'].number,
    expandedRowRender: _vueTypes2['default'].func,
    expandIcon: _vueTypes2['default'].func,
    childrenColumnName: _vueTypes2['default'].string,
    indentSize: _vueTypes2['default'].number,
    // onExpand: PropTypes.func,
    // onExpandedRowsChange: PropTypes.func,
    columnManager: _vueTypes2['default'].object.isRequired,
    prefixCls: _vueTypes2['default'].string.isRequired,
    data: _vueTypes2['default'].array,
    getRowKey: _vueTypes2['default'].func
  };
};

var ExpandableTable = {
  name: 'ExpandableTable',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(ExpandableTableProps(), {
    expandIconAsCell: false,
    expandedRowClassName: function expandedRowClassName() {
      return '';
    },
    expandIconColumnIndex: 0,
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],
    childrenColumnName: 'children',
    indentSize: 15
  }),
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  data: function data() {
    var data = this.data,
        childrenColumnName = this.childrenColumnName,
        defaultExpandAllRows = this.defaultExpandAllRows,
        expandedRowKeys = this.expandedRowKeys,
        defaultExpandedRowKeys = this.defaultExpandedRowKeys,
        getRowKey = this.getRowKey;


    var finalExpandedRowKeys = [];
    var rows = [].concat((0, _toConsumableArray3['default'])(data));

    if (defaultExpandAllRows) {
      for (var i = 0; i < rows.length; i += 1) {
        var row = rows[i];
        finalExpandedRowKeys.push(getRowKey(row, i));
        rows = rows.concat(row[childrenColumnName] || []);
      }
    } else {
      finalExpandedRowKeys = expandedRowKeys || defaultExpandedRowKeys;
    }

    // this.columnManager = props.columnManager
    // this.store = props.store

    this.store.expandedRowsHeight = {};
    this.store.expandedRowKeys = finalExpandedRowKeys;
    return {};
  },
  mounted: function mounted() {
    this.handleUpdated();
  },
  updated: function updated() {
    this.handleUpdated();
  },

  watch: {
    expandedRowKeys: function expandedRowKeys(val) {
      var _this = this;

      this.$nextTick(function () {
        _this.store.expandedRowKeys = val;
      });
    }
  },
  methods: {
    handleUpdated: function handleUpdated() {
      // We should record latest expanded rows to avoid multiple rows remove cause `onExpandedRowsChange` trigger many times
      this.latestExpandedRows = null;
    },
    handleExpandChange: function handleExpandChange(expanded, record, event, rowKey) {
      var destroy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      var expandedRowKeys = this.store.expandedRowKeys;


      if (expanded) {
        // row was expaned
        expandedRowKeys = [].concat((0, _toConsumableArray3['default'])(expandedRowKeys), [rowKey]);
      } else {
        // row was collapse
        var expandedRowIndex = expandedRowKeys.indexOf(rowKey);
        if (expandedRowIndex !== -1) {
          expandedRowKeys = (0, _utils.remove)(expandedRowKeys, rowKey);
        }
      }

      if (!this.expandedRowKeys) {
        this.store.expandedRowKeys = expandedRowKeys;
      }
      // De-dup of repeat call
      if (!this.latestExpandedRows || !(0, _shallowequal2['default'])(this.latestExpandedRows, expandedRowKeys)) {
        this.latestExpandedRows = expandedRowKeys;
        this.__emit('expandedRowsChange', expandedRowKeys);
        this.__emit('update:expandedRowKeys', expandedRowKeys);
      }

      if (!destroy) {
        this.__emit('expand', expanded, record);
      }
    },
    renderExpandIndentCell: function renderExpandIndentCell(rows, fixed) {
      var prefixCls = this.prefixCls,
          expandIconAsCell = this.expandIconAsCell;

      if (!expandIconAsCell || fixed === 'right' || !rows.length) {
        return;
      }

      var iconColumn = {
        key: 'rc-table-expand-icon-cell',
        className: prefixCls + '-expand-icon-th',
        title: '',
        rowSpan: rows.length
      };

      rows[0].unshift((0, _extends3['default'])({}, iconColumn, { column: iconColumn }));
    },
    renderExpandedRow: function renderExpandedRow(record, index, expandedRowRender, className, ancestorKeys, indent, fixed) {
      var _this2 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          expandIconAsCell = this.expandIconAsCell,
          indentSize = this.indentSize;

      var parentKey = ancestorKeys[ancestorKeys.length - 1];
      var rowKey = parentKey + '-extra-row';
      var components = {
        body: {
          row: 'tr',
          cell: 'td'
        }
      };
      var colCount = void 0;
      if (fixed === 'left') {
        colCount = this.columnManager.leftLeafColumns().length;
      } else if (fixed === 'right') {
        colCount = this.columnManager.rightLeafColumns().length;
      } else {
        colCount = this.columnManager.leafColumns().length;
      }
      var columns = [{
        key: 'extra-row',
        customRender: function customRender() {
          var expandedRowKeys = _this2.store.expandedRowKeys;

          var expanded = expandedRowKeys.includes(parentKey);
          return {
            attrs: {
              colSpan: colCount
            },
            children: fixed !== 'right' ? expandedRowRender(record, index, indent, expanded) : '&nbsp;'
          };
        }
      }];
      if (expandIconAsCell && fixed !== 'right') {
        columns.unshift({
          key: 'expand-icon-placeholder',
          customRender: function customRender() {
            return null;
          }
        });
      }

      return h(_TableRow2['default'], {
        key: rowKey,
        attrs: { columns: columns,

          rowKey: rowKey,
          ancestorKeys: ancestorKeys,
          prefixCls: prefixCls + '-expanded-row',
          indentSize: indentSize,
          indent: indent,
          fixed: fixed,
          components: components,
          expandedRow: true,
          hasExpandIcon: function hasExpandIcon() {}
        },
        'class': className });
    },
    renderRows: function renderRows(_renderRows, rows, record, index, indent, fixed, parentKey, ancestorKeys) {
      var expandedRowClassName = this.expandedRowClassName,
          expandedRowRender = this.expandedRowRender,
          childrenColumnName = this.childrenColumnName;

      var childrenData = record[childrenColumnName];
      var nextAncestorKeys = [].concat((0, _toConsumableArray3['default'])(ancestorKeys), [parentKey]);
      var nextIndent = indent + 1;

      if (expandedRowRender) {
        rows.push(this.renderExpandedRow(record, index, expandedRowRender, expandedRowClassName(record, index, indent), nextAncestorKeys, nextIndent, fixed));
      }

      if (childrenData) {
        rows.push.apply(rows, (0, _toConsumableArray3['default'])(_renderRows(childrenData, nextIndent, nextAncestorKeys)));
      }
    }
  },

  render: function render() {
    var data = this.data,
        childrenColumnName = this.childrenColumnName,
        $scopedSlots = this.$scopedSlots;

    var props = (0, _propsUtil.getOptionProps)(this);
    var needIndentSpaced = data.some(function (record) {
      return record[childrenColumnName];
    });

    return $scopedSlots['default'] && $scopedSlots['default']({
      props: props,
      on: (0, _propsUtil.getListeners)(this),
      needIndentSpaced: needIndentSpaced,
      renderRows: this.renderRows,
      handleExpandChange: this.handleExpandChange,
      renderExpandIndentCell: this.renderExpandIndentCell
    });
  }
};

exports['default'] = ExpandableTable;