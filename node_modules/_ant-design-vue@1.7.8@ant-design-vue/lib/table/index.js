'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _propsUtil = require('../_util/props-util');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' });

var Table = {
  name: 'ATable',
  Column: _Table2['default'].Column,
  ColumnGroup: _Table2['default'].ColumnGroup,
  props: _Table2['default'].props,
  methods: {
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
          /*
          Convert events on template Column to function props onPropAbcChange in Table.columns prop.
          If you write template code like below:
          <Column @prop-abc-change="f1" @update:prop-abc="f2" :prop-abc.sync="dataAbc" />
          You will get these events:
          {
            'prop-abc-change': this.f1,
            'update:prop-abc': [this.f2, e => this.dataAbc = e],
            'update:propAbc': e => this.dataAbc = e,
          }
          All of these events would be treat as column.onPropAbcChange,
          but only one of them will be valid, which can not be determined.
          */
          var k = void 0;
          if (e.startsWith('update:')) {
            k = 'on-' + e.substr('update:'.length) + '-change';
          } else {
            k = 'on-' + e;
          }
          listeners[(0, _propsUtil.camelize)(k)] = events[e];
        });

        var _getSlots = (0, _propsUtil.getSlots)(element),
            children = _getSlots['default'],
            restSlots = (0, _objectWithoutProperties3['default'])(_getSlots, ['default']);

        var column = (0, _extends3['default'])({}, restSlots, props, { style: style, 'class': cls }, listeners);
        if (key) {
          column.key = key;
        }
        if ((0, _propsUtil.getSlotOptions)(element).__ANT_TABLE_COLUMN_GROUP) {
          column.children = _this.normalize(typeof children === 'function' ? children() : children);
        } else {
          var customRender = element.data && element.data.scopedSlots && element.data.scopedSlots['default'];
          column.customRender = column.customRender || customRender;
        }
        columns.push(column);
      });
      return columns;
    },
    updateColumns: function updateColumns() {
      var _this2 = this;

      var cols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var columns = [];
      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;

      cols.forEach(function (col) {
        var _col$slots = col.slots,
            slots = _col$slots === undefined ? {} : _col$slots,
            _col$scopedSlots = col.scopedSlots,
            scopedSlots = _col$scopedSlots === undefined ? {} : _col$scopedSlots,
            restProps = (0, _objectWithoutProperties3['default'])(col, ['slots', 'scopedSlots']);

        var column = (0, _extends3['default'])({}, restProps);
        Object.keys(slots).forEach(function (key) {
          var name = slots[key];
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name].length === 1 ? $slots[name][0] : $slots[name];
          }
        });
        Object.keys(scopedSlots).forEach(function (key) {
          var name = scopedSlots[key];
          if (column[key] === undefined && $scopedSlots[name]) {
            column[key] = $scopedSlots[name];
          }
        });
        // if (slotScopeName && $scopedSlots[slotScopeName]) {
        //   column.customRender = column.customRender || $scopedSlots[slotScopeName]
        // }
        if (col.children) {
          column.children = _this2.updateColumns(column.children);
        }
        columns.push(column);
      });
      return columns;
    }
  },
  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        normalize = this.normalize,
        $scopedSlots = this.$scopedSlots;

    var props = (0, _propsUtil.getOptionProps)(this);
    var columns = props.columns ? this.updateColumns(props.columns) : normalize($slots['default']);
    var title = props.title,
        footer = props.footer;
    var slotTitle = $scopedSlots.title,
        slotFooter = $scopedSlots.footer,
        _$scopedSlots$expande = $scopedSlots.expandedRowRender,
        expandedRowRender = _$scopedSlots$expande === undefined ? props.expandedRowRender : _$scopedSlots$expande,
        expandIcon = $scopedSlots.expandIcon;

    title = title || slotTitle;
    footer = footer || slotFooter;
    var tProps = {
      props: (0, _extends3['default'])({}, props, {
        columns: columns,
        title: title,
        footer: footer,
        expandedRowRender: expandedRowRender,
        expandIcon: this.$props.expandIcon || expandIcon
      }),
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(_Table2['default'], tProps);
  }
};
/* istanbul ignore next */
Table.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Table.name, Table);
  Vue.component(Table.Column.name, Table.Column);
  Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
};

exports['default'] = Table;