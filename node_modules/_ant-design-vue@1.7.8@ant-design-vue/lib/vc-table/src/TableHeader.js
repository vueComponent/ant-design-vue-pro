'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _TableHeaderRow = require('./TableHeaderRow');

var _TableHeaderRow2 = _interopRequireDefault(_TableHeaderRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getHeaderRows(_ref) {
  var _ref$columns = _ref.columns,
      columns = _ref$columns === undefined ? [] : _ref$columns,
      _ref$currentRow = _ref.currentRow,
      currentRow = _ref$currentRow === undefined ? 0 : _ref$currentRow,
      _ref$rows = _ref.rows,
      rows = _ref$rows === undefined ? [] : _ref$rows,
      _ref$isLast = _ref.isLast,
      isLast = _ref$isLast === undefined ? true : _ref$isLast;

  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach(function (column, i) {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    var cellIsLast = isLast && i === columns.length - 1;
    var cell = {
      key: column.key,
      className: column.className || column['class'] || '',
      children: column.title,
      isLast: cellIsLast,
      column: column
    };
    if (column.children) {
      getHeaderRows({
        columns: column.children,
        currentRow: currentRow + 1,
        rows: rows,
        isLast: cellIsLast
      });
    }
    if ('colSpan' in column) {
      cell.colSpan = column.colSpan;
    }
    if ('rowSpan' in column) {
      cell.rowSpan = column.rowSpan;
    }
    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(function (row) {
    return row.length > 0;
  });
}

exports['default'] = {
  name: 'TableHeader',
  props: {
    fixed: _vueTypes2['default'].string,
    columns: _vueTypes2['default'].array.isRequired,
    expander: _vueTypes2['default'].object.isRequired
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } }
  },

  render: function render() {
    var h = arguments[0];
    var _table = this.table,
        components = _table.sComponents,
        prefixCls = _table.prefixCls,
        showHeader = _table.showHeader,
        customHeaderRow = _table.customHeaderRow;
    var expander = this.expander,
        columns = this.columns,
        fixed = this.fixed;


    if (!showHeader) {
      return null;
    }

    var rows = getHeaderRows({ columns: columns });

    expander.renderExpandIndentCell(rows, fixed);

    var HeaderWrapper = components.header.wrapper;

    return h(
      HeaderWrapper,
      { 'class': prefixCls + '-thead' },
      [rows.map(function (row, index) {
        return h(_TableHeaderRow2['default'], {
          attrs: {
            prefixCls: prefixCls,

            index: index,
            fixed: fixed,
            columns: columns,
            rows: rows,
            row: row,
            components: components,
            customHeaderRow: customHeaderRow
          },
          key: index });
      })]
    );
  }
};