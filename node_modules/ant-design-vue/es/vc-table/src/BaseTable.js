import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
import { mergeProps, getListeners } from '../../_util/props-util';
function noop() {}
var BaseTable = {
  name: 'BaseTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    hasHead: PropTypes.bool.isRequired,
    hasBody: PropTypes.bool.isRequired,
    expander: PropTypes.object.isRequired,
    getRowKey: PropTypes.func,
    isAnyColumnsFixed: PropTypes.bool
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } },
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  methods: {
    getColumns: function getColumns(cols) {
      var _$props = this.$props,
          _$props$columns = _$props.columns,
          columns = _$props$columns === undefined ? [] : _$props$columns,
          fixed = _$props.fixed;
      var table = this.table;
      var prefixCls = table.$props.prefixCls;

      return (cols || columns).map(function (column) {
        return _extends({}, column, {
          className: !!column.fixed && !fixed ? classNames(prefixCls + '-fixed-columns-in-body', column.className || column['class']) : column.className || column['class']
        });
      });
    },
    handleRowHover: function handleRowHover(isHover, key) {
      this.store.currentHoverKey = isHover ? key : null;
    },
    renderRows: function renderRows(renderData, indent) {
      var _this = this;

      var ancestorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var h = this.$createElement;
      var _table = this.table,
          columnManager = _table.columnManager,
          components = _table.sComponents,
          prefixCls = _table.prefixCls,
          childrenColumnName = _table.childrenColumnName,
          rowClassName = _table.rowClassName,
          _table$customRow = _table.customRow,
          customRow = _table$customRow === undefined ? noop : _table$customRow;

      var _getListeners = getListeners(this.table),
          _getListeners$rowClic = _getListeners.rowClick,
          onRowClick = _getListeners$rowClic === undefined ? noop : _getListeners$rowClic,
          _getListeners$rowDoub = _getListeners.rowDoubleclick,
          onRowDoubleClick = _getListeners$rowDoub === undefined ? noop : _getListeners$rowDoub,
          _getListeners$rowCont = _getListeners.rowContextmenu,
          onRowContextMenu = _getListeners$rowCont === undefined ? noop : _getListeners$rowCont,
          _getListeners$rowMous = _getListeners.rowMouseenter,
          onRowMouseEnter = _getListeners$rowMous === undefined ? noop : _getListeners$rowMous,
          _getListeners$rowMous2 = _getListeners.rowMouseleave,
          onRowMouseLeave = _getListeners$rowMous2 === undefined ? noop : _getListeners$rowMous2;

      var getRowKey = this.getRowKey,
          fixed = this.fixed,
          expander = this.expander,
          isAnyColumnsFixed = this.isAnyColumnsFixed;


      var rows = [];

      var _loop = function _loop(i) {
        var record = renderData[i];
        var key = getRowKey(record, i);
        var className = typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

        var onHoverProps = {};
        if (columnManager.isAnyColumnsFixed()) {
          onHoverProps.hover = _this.handleRowHover;
        }

        var leafColumns = void 0;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = _this.getColumns(columnManager.leafColumns());
        }

        var rowPrefixCls = prefixCls + '-row';

        var expandableRowProps = {
          props: _extends({}, expander.props, {
            fixed: fixed,
            index: i,
            prefixCls: rowPrefixCls,
            record: record,
            rowKey: key,
            needIndentSpaced: expander.needIndentSpaced
          }),
          key: key,
          on: {
            // ...expander.on,
            rowClick: onRowClick,
            expandedChange: expander.handleExpandChange
          },
          scopedSlots: {
            'default': function _default(expandableRow) {
              var tableRowProps = mergeProps({
                props: {
                  fixed: fixed,
                  indent: indent,
                  record: record,
                  index: i,
                  prefixCls: rowPrefixCls,
                  childrenColumnName: childrenColumnName,
                  columns: leafColumns,
                  rowKey: key,
                  ancestorKeys: ancestorKeys,
                  components: components,
                  isAnyColumnsFixed: isAnyColumnsFixed,
                  customRow: customRow
                },
                on: _extends({
                  rowDoubleclick: onRowDoubleClick,
                  rowContextmenu: onRowContextMenu,
                  rowMouseenter: onRowMouseEnter,
                  rowMouseleave: onRowMouseLeave
                }, onHoverProps),
                'class': className,
                ref: 'row_' + i + '_' + indent
              }, expandableRow);
              return h(TableRow, tableRowProps);
            }
          }
        };
        var row = h(ExpandableRow, expandableRowProps);

        rows.push(row);
        expander.renderRows(_this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
      };

      for (var i = 0; i < renderData.length; i += 1) {
        _loop(i);
      }
      return rows;
    }
  },

  render: function render() {
    var h = arguments[0];
    var _table2 = this.table,
        components = _table2.sComponents,
        prefixCls = _table2.prefixCls,
        scroll = _table2.scroll,
        data = _table2.data,
        getBodyWrapper = _table2.getBodyWrapper;
    var _$props2 = this.$props,
        expander = _$props2.expander,
        tableClassName = _$props2.tableClassName,
        hasHead = _$props2.hasHead,
        hasBody = _$props2.hasBody,
        fixed = _$props2.fixed,
        isAnyColumnsFixed = _$props2.isAnyColumnsFixed;

    var columns = this.getColumns();
    var tableStyle = {};

    if (!fixed && scroll.x) {
      // 当有固定列时，width auto 会导致 body table 的宽度撑不开，从而固定列无法对齐
      // 详情见：https://github.com/ant-design/ant-design/issues/22160
      var tableWidthScrollX = isAnyColumnsFixed ? 'max-content' : 'auto';
      // not set width, then use content fixed width
      tableStyle.width = scroll.x === true ? tableWidthScrollX : scroll.x;
      tableStyle.width = typeof tableStyle.width === 'number' ? tableStyle.width + 'px' : tableStyle.width;
    }
    if (fixed) {
      var width = columns.reduce(function (sum, _ref) {
        var w = _ref.width;

        return sum + parseFloat(w, 10);
      }, 0);
      if (width > 0) {
        tableStyle.width = width + 'px';
      }
    }

    var Table = hasBody ? components.table : 'table';
    var BodyWrapper = components.body.wrapper;

    var body = void 0;
    if (hasBody) {
      body = h(
        BodyWrapper,
        { 'class': prefixCls + '-tbody' },
        [this.renderRows(data, 0)]
      );
      if (getBodyWrapper) {
        body = getBodyWrapper(body);
      }
    }
    return h(
      Table,
      { 'class': tableClassName, style: tableStyle, key: 'table' },
      [h(ColGroup, {
        attrs: { columns: columns, fixed: fixed }
      }), hasHead && h(TableHeader, {
        attrs: { expander: expander, columns: columns, fixed: fixed }
      }), body]
    );
  }
};

export default BaseTable;