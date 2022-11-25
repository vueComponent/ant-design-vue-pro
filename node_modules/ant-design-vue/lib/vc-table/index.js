'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTERNAL_COL_DEFINE = exports.ColumnGroup = exports.Column = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Table = require('./src/Table');

var _Table2 = _interopRequireDefault(_Table);

var _Column = require('./src/Column');

var _Column2 = _interopRequireDefault(_Column);

var _ColumnGroup = require('./src/ColumnGroup');

var _ColumnGroup2 = _interopRequireDefault(_ColumnGroup);

var _propsUtil = require('../_util/props-util');

var _utils = require('./src/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Table = {
  name: 'Table',
  Column: _Column2['default'],
  ColumnGroup: _ColumnGroup2['default'],
  props: _Table2['default'].props,
  methods: {
    getTableNode: function getTableNode() {
      return this.$refs.table.tableNode;
    },
    getBodyTable: function getBodyTable() {
      return this.$refs.table.ref_bodyTable;
    },
    normalize: function normalize() {
      var _this = this;

      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var columns = [];
      elements.forEach(function (element) {
        if (!element.tag) {
          return;
        }
        var key = (0, _propsUtil.getKey)(element);
        var style = (0, _propsUtil.getStyle)(element);
        var cls = (0, _propsUtil.getClass)(element);
        var props = (0, _propsUtil.getOptionProps)(element);
        var events = (0, _propsUtil.getEvents)(element);
        var listeners = {};
        Object.keys(events).forEach(function (e) {
          var k = 'on-' + e;
          listeners[(0, _propsUtil.camelize)(k)] = events[e];
        });

        var _getSlots = (0, _propsUtil.getSlots)(element),
            children = _getSlots['default'],
            title = _getSlots.title;

        var column = (0, _extends3['default'])({ title: title }, props, { style: style, 'class': cls }, listeners);
        if (key) {
          column.key = key;
        }
        if ((0, _propsUtil.getSlotOptions)(element).isTableColumnGroup) {
          column.children = _this.normalize(typeof children === 'function' ? children() : children);
        } else {
          var customRender = element.data && element.data.scopedSlots && element.data.scopedSlots['default'];
          column.customRender = column.customRender || customRender;
        }
        columns.push(column);
      });
      return columns;
    }
  },
  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        normalize = this.normalize;

    var props = (0, _propsUtil.getOptionProps)(this);
    var columns = props.columns || normalize($slots['default']);
    var tProps = {
      props: (0, _extends3['default'])({}, props, {
        columns: columns
      }),
      on: (0, _propsUtil.getListeners)(this),
      ref: 'table'
    };
    return h(_Table2['default'], tProps);
  }
}; // base rc-table 6.10.9
exports['default'] = Table;
exports.Column = _Column2['default'];
exports.ColumnGroup = _ColumnGroup2['default'];
exports.INTERNAL_COL_DEFINE = _utils.INTERNAL_COL_DEFINE;