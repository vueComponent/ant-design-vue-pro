import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import TableCell from './TableCell';
import { initDefaultProps, mergeProps, getStyle as _getStyle } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import warning from '../../_util/warning';
function noop() {}
var TableRow = {
  name: 'TableRow',
  mixins: [BaseMixin],
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  props: initDefaultProps({
    customRow: PropTypes.func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    // onHover: PropTypes.func,
    columns: PropTypes.array,
    index: PropTypes.number,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    hasExpandIcon: PropTypes.func,
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    renderExpandIcon: PropTypes.func,
    renderExpandIconCell: PropTypes.func,
    components: PropTypes.any,
    expandedRow: PropTypes.bool,
    isAnyColumnsFixed: PropTypes.bool,
    ancestorKeys: PropTypes.array.isRequired,
    expandIconColumnIndex: PropTypes.number,
    expandRowByClick: PropTypes.bool
    // visible: PropTypes.bool,
    // hovered: PropTypes.bool,
    // height: PropTypes.any,
  }, {
    // expandIconColumnIndex: 0,
    // expandRowByClick: false,
    hasExpandIcon: function hasExpandIcon() {},
    renderExpandIcon: function renderExpandIcon() {},
    renderExpandIconCell: function renderExpandIconCell() {}
  }),

  computed: {
    visible: function visible() {
      var expandedRowKeys = this.store.expandedRowKeys;
      var ancestorKeys = this.$props.ancestorKeys;

      return !!(ancestorKeys.length === 0 || ancestorKeys.every(function (k) {
        return expandedRowKeys.includes(k);
      }));
    },
    height: function height() {
      var _store = this.store,
          expandedRowsHeight = _store.expandedRowsHeight,
          fixedColumnsBodyRowsHeight = _store.fixedColumnsBodyRowsHeight;
      var _$props = this.$props,
          fixed = _$props.fixed,
          rowKey = _$props.rowKey;


      if (!fixed) {
        return null;
      }

      if (expandedRowsHeight[rowKey]) {
        return expandedRowsHeight[rowKey];
      }

      if (fixedColumnsBodyRowsHeight[rowKey]) {
        return fixedColumnsBodyRowsHeight[rowKey];
      }

      return null;
    },
    hovered: function hovered() {
      var currentHoverKey = this.store.currentHoverKey;
      var rowKey = this.$props.rowKey;

      return currentHoverKey === rowKey;
    }
  },

  data: function data() {
    // this.shouldRender = this.visible
    return {
      shouldRender: this.visible
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.shouldRender) {
      this.$nextTick(function () {
        _this.saveRowRef();
      });
    }
  },

  watch: {
    visible: {
      handler: function handler(val) {
        if (val) {
          this.shouldRender = true;
        }
      },

      immediate: true
    }
  },

  updated: function updated() {
    var _this2 = this;

    if (this.shouldRender && !this.rowRef) {
      this.$nextTick(function () {
        _this2.saveRowRef();
      });
    }
  },

  methods: {
    onRowClick: function onRowClick(event) {
      var rowPropFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var record = this.record,
          index = this.index;

      this.__emit('rowClick', record, index, event);
      rowPropFunc(event);
    },
    onRowDoubleClick: function onRowDoubleClick(event) {
      var rowPropFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var record = this.record,
          index = this.index;

      this.__emit('rowDoubleClick', record, index, event);
      rowPropFunc(event);
    },
    onContextMenu: function onContextMenu(event) {
      var rowPropFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var record = this.record,
          index = this.index;

      this.__emit('rowContextmenu', record, index, event);
      rowPropFunc(event);
    },
    onMouseEnter: function onMouseEnter(event) {
      var rowPropFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var record = this.record,
          index = this.index,
          rowKey = this.rowKey;

      this.__emit('hover', true, rowKey);
      this.__emit('rowMouseenter', record, index, event);
      rowPropFunc(event);
    },
    onMouseLeave: function onMouseLeave(event) {
      var rowPropFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var record = this.record,
          index = this.index,
          rowKey = this.rowKey;

      this.__emit('hover', false, rowKey);
      this.__emit('rowMouseleave', record, index, event);
      rowPropFunc(event);
    },
    setExpandedRowHeight: function setExpandedRowHeight() {
      var store = this.store,
          rowKey = this.rowKey;
      var expandedRowsHeight = store.expandedRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = _extends({}, expandedRowsHeight, _defineProperty({}, rowKey, height));
      store.expandedRowsHeight = expandedRowsHeight;
    },
    setRowHeight: function setRowHeight() {
      var store = this.store,
          rowKey = this.rowKey;
      var fixedColumnsBodyRowsHeight = store.fixedColumnsBodyRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      store.fixedColumnsBodyRowsHeight = _extends({}, fixedColumnsBodyRowsHeight, _defineProperty({}, rowKey, height));
    },
    getStyle: function getStyle() {
      var height = this.height,
          visible = this.visible;

      var style = _getStyle(this);
      if (height) {
        style = _extends({}, style, { height: height });
      }

      if (!visible && !style.display) {
        style = _extends({}, style, { display: 'none' });
      }

      return style;
    },
    saveRowRef: function saveRowRef() {
      this.rowRef = this.$el;

      var isAnyColumnsFixed = this.isAnyColumnsFixed,
          fixed = this.fixed,
          expandedRow = this.expandedRow,
          ancestorKeys = this.ancestorKeys;


      if (!isAnyColumnsFixed) {
        return;
      }

      if (!fixed && expandedRow) {
        this.setExpandedRowHeight();
      }

      if (!fixed && ancestorKeys.length >= 0) {
        this.setRowHeight();
      }
    }
  },

  render: function render() {
    var _this3 = this;

    var h = arguments[0];

    if (!this.shouldRender) {
      return null;
    }

    var prefixCls = this.prefixCls,
        columns = this.columns,
        record = this.record,
        rowKey = this.rowKey,
        index = this.index,
        _customRow = this.customRow,
        customRow = _customRow === undefined ? noop : _customRow,
        indent = this.indent,
        indentSize = this.indentSize,
        hovered = this.hovered,
        height = this.height,
        visible = this.visible,
        components = this.components,
        hasExpandIcon = this.hasExpandIcon,
        renderExpandIcon = this.renderExpandIcon,
        renderExpandIconCell = this.renderExpandIconCell;

    var BodyRow = components.body.row;
    var BodyCell = components.body.cell;

    var className = '';

    if (hovered) {
      className += ' ' + prefixCls + '-hover';
    }

    var cells = [];

    renderExpandIconCell(cells);

    for (var i = 0; i < columns.length; i += 1) {
      var column = columns[i];

      warning(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[customCell] instead.');

      cells.push(h(TableCell, {
        attrs: {
          prefixCls: prefixCls,
          record: record,
          indentSize: indentSize,
          indent: indent,
          index: index,
          column: column,

          expandIcon: hasExpandIcon(i) && renderExpandIcon(),
          component: BodyCell
        },
        key: column.key || column.dataIndex }));
    }

    var _ref = customRow(record, index) || {},
        customClass = _ref['class'],
        customClassName = _ref.className,
        customStyle = _ref.style,
        rowProps = _objectWithoutProperties(_ref, ['class', 'className', 'style']);

    var style = { height: typeof height === 'number' ? height + 'px' : height };

    if (!visible) {
      style.display = 'none';
    }

    style = _extends({}, style, customStyle);
    var rowClassName = classNames(prefixCls, className, prefixCls + '-level-' + indent, customClassName, customClass);
    var rowPropEvents = rowProps.on || {};
    var bodyRowProps = mergeProps(_extends({}, rowProps, { style: style }), {
      on: {
        click: function click(e) {
          _this3.onRowClick(e, rowPropEvents.click);
        },
        dblclick: function dblclick(e) {
          _this3.onRowDoubleClick(e, rowPropEvents.dblclick);
        },
        mouseenter: function mouseenter(e) {
          _this3.onMouseEnter(e, rowPropEvents.mouseenter);
        },
        mouseleave: function mouseleave(e) {
          _this3.onMouseLeave(e, rowPropEvents.mouseleave);
        },
        contextmenu: function contextmenu(e) {
          _this3.onContextMenu(e, rowPropEvents.contextmenu);
        }
      },
      'class': rowClassName
    }, {
      attrs: {
        'data-row-key': rowKey
      }
    });
    return h(
      BodyRow,
      bodyRowProps,
      [cells]
    );
  }
};

export default TableRow;