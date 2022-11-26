'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function isInvalidRenderCellText(text) {
  return text && !(0, _propsUtil.isValidElement)(text) && Object.prototype.toString.call(text) === '[object Object]';
}

exports['default'] = {
  name: 'TableCell',
  props: {
    record: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    index: _vueTypes2['default'].number,
    indent: _vueTypes2['default'].number,
    indentSize: _vueTypes2['default'].number,
    column: _vueTypes2['default'].object,
    expandIcon: _vueTypes2['default'].any,
    component: _vueTypes2['default'].any
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } }
  },
  methods: {
    handleClick: function handleClick(e) {
      var record = this.record,
          onCellClick = this.column.onCellClick;

      if (onCellClick) {
        onCellClick(record, e);
      }
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var record = this.record,
        indentSize = this.indentSize,
        prefixCls = this.prefixCls,
        indent = this.indent,
        index = this.index,
        expandIcon = this.expandIcon,
        column = this.column,
        BodyCell = this.component;
    var dataIndex = column.dataIndex,
        customRender = column.customRender,
        _column$className = column.className,
        className = _column$className === undefined ? '' : _column$className;
    var transformCellText = this.table.transformCellText;
    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.

    var text = void 0;
    if (typeof dataIndex === 'number') {
      text = (0, _get2['default'])(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = (0, _get2['default'])(record, dataIndex);
    }
    var tdProps = {
      props: {},
      attrs: {},
      on: {
        click: this.handleClick
      }
    };
    var colSpan = void 0;
    var rowSpan = void 0;

    if (customRender) {
      text = customRender(text, record, index, column);
      if (isInvalidRenderCellText(text)) {
        tdProps.attrs = text.attrs || {};
        tdProps.props = text.props || {};
        tdProps['class'] = text['class'];
        tdProps.style = text.style;
        colSpan = tdProps.attrs.colSpan;
        rowSpan = tdProps.attrs.rowSpan;
        text = text.children;
      }
    }

    if (column.customCell) {
      tdProps = (0, _propsUtil.mergeProps)(tdProps, column.customCell(record, index));
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (isInvalidRenderCellText(text)) {
      text = null;
    }

    if (transformCellText) {
      text = transformCellText({ text: text, column: column, record: record, index: index });
    }

    var indentText = expandIcon ? h('span', {
      style: { paddingLeft: indentSize * indent + 'px' },
      'class': prefixCls + '-indent indent-level-' + indent
    }) : null;

    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    if (column.align) {
      tdProps.style = (0, _extends3['default'])({ textAlign: column.align }, tdProps.style);
    }

    var cellClassName = (0, _classnames2['default'])(className, column['class'], (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-cell-ellipsis', !!column.ellipsis), (0, _defineProperty3['default'])(_classNames, prefixCls + '-cell-break-word', !!column.width), _classNames));

    if (column.ellipsis) {
      if (typeof text === 'string') {
        tdProps.attrs.title = text;
      } else if (text) {
        // const { props: textProps } = text;
        // if (textProps && textProps.children && typeof textProps.children === 'string') {
        //   tdProps.attrs.title = textProps.children;
        // }
      }
    }

    return h(
      BodyCell,
      (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': cellClassName }, tdProps]),
      [indentText, expandIcon, text]
    );
  }
};