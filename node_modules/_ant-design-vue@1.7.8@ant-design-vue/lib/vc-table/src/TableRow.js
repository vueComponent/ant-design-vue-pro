'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _warning = require('../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var TableRow = {
  name: 'TableRow',
  mixins: [_BaseMixin2['default']],
  inject: {
    store: { from: 'table-store', 'default': function _default() {
        return {};
      } }
  },
  props: (0, _propsUtil.initDefaultProps)({
    customRow: _vueTypes2['default'].func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    record: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    // onHover: PropTypes.func,
    columns: _vueTypes2['default'].array,
    index: _vueTypes2['default'].number,
    rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]).isRequired,
    className: _vueTypes2['default'].string,
    indent: _vueTypes2['default'].number,
    indentSize: _vueTypes2['default'].number,
    hasExpandIcon: _vueTypes2['default'].func,
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    renderExpandIcon: _vueTypes2['default'].func,
    renderExpandIconCell: _vueTypes2['default'].func,
    components: _vueTypes2['default'].any,
    expandedRow: _vueTypes2['default'].bool,
    isAnyColumnsFixed: _vueTypes2['default'].bool,
    ancestorKeys: _vueTypes2['default'].array.isRequired,
    expandIconColumnIndex: _vueTypes2['default'].number,
    expandRowByClick: _vueTypes2['default'].bool
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
      expandedRowsHeight = (0, _extends5['default'])({}, expandedRowsHeight, (0, _defineProperty3['default'])({}, rowKey, height));
      store.expandedRowsHeight = expandedRowsHeight;
    },
    setRowHeight: function setRowHeight() {
      var store = this.store,
          rowKey = this.rowKey;
      var fixedColumnsBodyRowsHeight = store.fixedColumnsBodyRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      store.fixedColumnsBodyRowsHeight = (0, _extends5['default'])({}, fixedColumnsBodyRowsHeight, (0, _defineProperty3['default'])({}, rowKey, height));
    },
    getStyle: function getStyle() {
      var height = this.height,
          visible = this.visible;

      var style = (0, _propsUtil.getStyle)(this);
      if (height) {
        style = (0, _extends5['default'])({}, style, { height: height });
      }

      if (!visible && !style.display) {
        style = (0, _extends5['default'])({}, style, { display: 'none' });
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

      (0, _warning2['default'])(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[customCell] instead.');

      cells.push(h(_TableCell2['default'], {
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
        rowProps = (0, _objectWithoutProperties3['default'])(_ref, ['class', 'className', 'style']);

    var style = { height: typeof height === 'number' ? height + 'px' : height };

    if (!visible) {
      style.display = 'none';
    }

    style = (0, _extends5['default'])({}, style, customStyle);
    var rowClassName = (0, _classnames2['default'])(prefixCls, className, prefixCls + '-level-' + indent, customClassName, customClass);
    var rowPropEvents = rowProps.on || {};
    var bodyRowProps = (0, _propsUtil.mergeProps)((0, _extends5['default'])({}, rowProps, { style: style }), {
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

exports['default'] = TableRow;