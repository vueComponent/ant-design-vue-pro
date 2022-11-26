'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TableHeaderRow = {
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  props: {
    index: _vueTypes2['default'].number,
    fixed: _vueTypes2['default'].string,
    columns: _vueTypes2['default'].array,
    rows: _vueTypes2['default'].array,
    row: _vueTypes2['default'].array,
    components: _vueTypes2['default'].object,
    customHeaderRow: _vueTypes2['default'].func,
    prefixCls: _vueTypes2['default'].string
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
    var style = (0, _extends3['default'])({ height: height }, customStyle);
    if (style.height === null) {
      delete style.height;
    }
    return h(
      HeaderRow,
      (0, _babelHelperVueJsxMergeProps2['default'])([rowProps, { style: style }]),
      [row.map(function (cell, i) {
        var _classNames;

        var column = cell.column,
            isLast = cell.isLast,
            children = cell.children,
            className = cell.className,
            cellProps = (0, _objectWithoutProperties3['default'])(cell, ['column', 'isLast', 'children', 'className']);

        var customProps = column.customHeaderCell ? column.customHeaderCell(column) : {};
        var headerCellProps = (0, _propsUtil.mergeProps)({
          attrs: (0, _extends3['default'])({}, cellProps)
        }, (0, _extends3['default'])({}, customProps, {
          key: column.key || column.dataIndex || i
        }));

        if (column.align) {
          headerCellProps.style = (0, _extends3['default'])({}, customProps.style, { textAlign: column.align });
        }

        headerCellProps['class'] = (0, _classnames2['default'])(customProps['class'], customProps.className, column['class'], column.className, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-align-' + column.align, !!column.align), (0, _defineProperty3['default'])(_classNames, prefixCls + '-row-cell-ellipsis', !!column.ellipsis), (0, _defineProperty3['default'])(_classNames, prefixCls + '-row-cell-break-word', !!column.width), (0, _defineProperty3['default'])(_classNames, prefixCls + '-row-cell-last', isLast), _classNames));

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

exports['default'] = TableHeaderRow;