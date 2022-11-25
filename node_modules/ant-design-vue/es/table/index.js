import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import T from './Table';
import ref from 'vue-ref';
import Vue from 'vue';
import { getOptionProps, getKey, getClass, getStyle, getEvents, getSlotOptions, camelize, getSlots, getListeners } from '../_util/props-util';
import Base from '../base';

Vue.use(ref, { name: 'ant-ref' });

var Table = {
  name: 'ATable',
  Column: T.Column,
  ColumnGroup: T.ColumnGroup,
  props: T.props,
  methods: {
    normalize: function normalize() {
      var _this = this;

      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var columns = [];
      elements.forEach(function (element) {
        if (!element.tag) {
          return;
        }
        var key = getKey(element);
        var style = getStyle(element);
        var cls = getClass(element);
        var props = getOptionProps(element);
        var events = getEvents(element);
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
          listeners[camelize(k)] = events[e];
        });

        var _getSlots = getSlots(element),
            children = _getSlots['default'],
            restSlots = _objectWithoutProperties(_getSlots, ['default']);

        var column = _extends({}, restSlots, props, { style: style, 'class': cls }, listeners);
        if (key) {
          column.key = key;
        }
        if (getSlotOptions(element).__ANT_TABLE_COLUMN_GROUP) {
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
            restProps = _objectWithoutProperties(col, ['slots', 'scopedSlots']);

        var column = _extends({}, restProps);
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

    var props = getOptionProps(this);
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
      props: _extends({}, props, {
        columns: columns,
        title: title,
        footer: footer,
        expandedRowRender: expandedRowRender,
        expandIcon: this.$props.expandIcon || expandIcon
      }),
      on: getListeners(this)
    };
    return h(T, tProps);
  }
};
/* istanbul ignore next */
Table.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Table.name, Table);
  Vue.component(Table.Column.name, Table.Column);
  Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
};

export default Table;