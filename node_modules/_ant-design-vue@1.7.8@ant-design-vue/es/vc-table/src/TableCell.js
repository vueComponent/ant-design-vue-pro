import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import get from 'lodash/get';
import classNames from 'classnames';
import { isValidElement, mergeProps } from '../../_util/props-util';

function isInvalidRenderCellText(text) {
  return text && !isValidElement(text) && Object.prototype.toString.call(text) === '[object Object]';
}

export default {
  name: 'TableCell',
  props: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    column: PropTypes.object,
    expandIcon: PropTypes.any,
    component: PropTypes.any
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
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
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
      tdProps = mergeProps(tdProps, column.customCell(record, index));
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
      tdProps.style = _extends({ textAlign: column.align }, tdProps.style);
    }

    var cellClassName = classNames(className, column['class'], (_classNames = {}, _defineProperty(_classNames, prefixCls + '-cell-ellipsis', !!column.ellipsis), _defineProperty(_classNames, prefixCls + '-cell-break-word', !!column.width), _classNames));

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
      _mergeJSXProps([{ 'class': cellClassName }, tdProps]),
      [indentText, expandIcon, text]
    );
  }
};