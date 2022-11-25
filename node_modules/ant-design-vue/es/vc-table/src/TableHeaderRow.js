import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import { mergeProps } from '../../_util/props-util';

var TableHeaderRow = {
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  props: {
    index: PropTypes.number,
    fixed: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    row: PropTypes.array,
    components: PropTypes.object,
    customHeaderRow: PropTypes.func,
    prefixCls: PropTypes.string
  },
  name: 'TableHeaderRow',
  computed: {
    height: function height() {
      var fixedColumnsHeadRowsHeight = this.store.fixedColumnsHeadRowsHeight;
      var _$props = this.$props,
          columns = _$props.columns,
          rows = _$props.rows,
          fixed = _$props.fixed;

      var headerHeight = fixedColumnsHeadRowsHeight[0];

      if (!fixed) {
        return null;
      }

      if (headerHeight && columns) {
        if (headerHeight === 'auto') {
          return 'auto';
        }
        return headerHeight / rows.length + 'px';
      }
      return null;
    }
  },
  render: function render(h) {
    var row = this.row,
        index = this.index,
        height = this.height,
        components = this.components,
        customHeaderRow = this.customHeaderRow,
        prefixCls = this.prefixCls;

    var HeaderRow = components.header.row;
    var HeaderCell = components.header.cell;
    var rowProps = customHeaderRow(row.map(function (cell) {
      return cell.column;
    }), index);
    var customStyle = rowProps ? rowProps.style : {};
    var style = _extends({ height: height }, customStyle);
    if (style.height === null) {
      delete style.height;
    }
    return h(
      HeaderRow,
      _mergeJSXProps([rowProps, { style: style }]),
      [row.map(function (cell, i) {
        var _classNames;

        var column = cell.column,
            isLast = cell.isLast,
            children = cell.children,
            className = cell.className,
            cellProps = _objectWithoutProperties(cell, ['column', 'isLast', 'children', 'className']);

        var customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};
        var headerCellProps = mergeProps({
          attrs: _extends({}, cellProps)
        }, _extends({}, customProps, {
          key: column.key || column.dataIndex || i
        }));

        if (column.align) {
          headerCellProps.style = _extends({}, customProps.style, { textAlign: column.align });
        }

        headerCellProps['class'] = classNames(customProps['class'], customProps.className, column['class'], column.className, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-align-' + column.align, !!column.align), _defineProperty(_classNames, prefixCls + '-row-cell-ellipsis', !!column.ellipsis), _defineProperty(_classNames, prefixCls + '-row-cell-break-word', !!column.width), _defineProperty(_classNames, prefixCls + '-row-cell-last', isLast), _classNames));

        if (typeof HeaderCell === 'function') {
          return HeaderCell(h, headerCellProps, children);
        }
        return h(
          HeaderCell,
          headerCellProps,
          [children]
        );
      })]
    );
  }
};

export default TableHeaderRow;