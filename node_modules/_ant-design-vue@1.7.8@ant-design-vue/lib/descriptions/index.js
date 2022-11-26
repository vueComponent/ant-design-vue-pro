'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DescriptionsProps = exports.DescriptionsItem = exports.DescriptionsItemProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _responsiveObserve = require('../_util/responsiveObserve');

var _responsiveObserve2 = _interopRequireDefault(_responsiveObserve);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _Col = require('./Col');

var _Col2 = _interopRequireDefault(_Col);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DescriptionsItemProps = exports.DescriptionsItemProps = {
  prefixCls: _vueTypes2['default'].string,
  label: _vueTypes2['default'].any,
  span: _vueTypes2['default'].number
};

function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

var DescriptionsItem = exports.DescriptionsItem = {
  name: 'ADescriptionsItem',
  props: (0, _propsUtil.initDefaultProps)(DescriptionsItemProps, { span: 1 })
};

var DescriptionsProps = exports.DescriptionsProps = {
  prefixCls: _vueTypes2['default'].string,
  bordered: _vueTypes2['default'].bool,
  size: _vueTypes2['default'].oneOf(['default', 'middle', 'small']).def('default'),
  title: _vueTypes2['default'].any,
  column: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].object]),
  layout: _vueTypes2['default'].oneOf(['horizontal', 'vertical']),
  colon: _vueTypes2['default'].bool
};

/**
 * Convert children into `column` groups.
 * @param children: DescriptionsItem
 * @param column: number
 */
var generateChildrenRows = function generateChildrenRows(children, column) {
  var rows = [];
  var columns = null;
  var leftSpans = void 0;

  var itemNodes = toArray(children);
  itemNodes.forEach(function (node, index) {
    var itemProps = (0, _propsUtil.getOptionProps)(node);
    var itemNode = node;

    if (!columns) {
      leftSpans = column;
      columns = [];
      rows.push(columns);
    }

    // Always set last span to align the end of Descriptions
    var lastItem = index === itemNodes.length - 1;
    var lastSpanSame = true;
    if (lastItem) {
      lastSpanSame = !itemProps.span || itemProps.span === leftSpans;
      itemNode = (0, _vnode.cloneElement)(itemNode, {
        props: {
          span: leftSpans
        }
      });
    }

    // Calculate left fill span
    var _itemProps$span = itemProps.span,
        span = _itemProps$span === undefined ? 1 : _itemProps$span;

    columns.push(itemNode);
    leftSpans -= span;

    if (leftSpans <= 0) {
      columns = null;

      (0, _warning2['default'])(leftSpans === 0 && lastSpanSame, 'Descriptions', 'Sum of column `span` in a line exceeds `column` of Descriptions.');
    }
  });

  return rows;
};

var defaultColumnMap = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};

var Descriptions = {
  name: 'ADescriptions',
  Item: DescriptionsItem,
  mixins: [_BaseMixin2['default']],
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  props: (0, _propsUtil.initDefaultProps)(DescriptionsProps, {
    column: defaultColumnMap
  }),
  data: function data() {
    return {
      screens: {},
      token: undefined
    };
  },

  methods: {
    getColumn: function getColumn() {
      var column = this.$props.column;

      if ((typeof column === 'undefined' ? 'undefined' : (0, _typeof3['default'])(column)) === 'object') {
        for (var i = 0; i < _responsiveObserve.responsiveArray.length; i++) {
          var breakpoint = _responsiveObserve.responsiveArray[i];
          if (this.screens[breakpoint] && column[breakpoint] !== undefined) {
            return column[breakpoint] || defaultColumnMap[breakpoint];
          }
        }
      }
      // If the configuration is not an object, it is a number, return number
      if (typeof column === 'number') {
        return column;
      }
      // If it is an object, but no response is found, this happens only in the test.
      // Maybe there are some strange environments
      return 3;
    },
    renderRow: function renderRow(children, index, _ref, bordered, layout, colon) {
      var prefixCls = _ref.prefixCls;
      var h = this.$createElement;

      var renderCol = function renderCol(colItem, type, idx) {
        return h(_Col2['default'], {
          attrs: {
            child: colItem,
            bordered: bordered,
            colon: colon,
            type: type,

            layout: layout
          },
          key: type + '-' + (colItem.key || idx) });
      };

      var cloneChildren = [];
      var cloneContentChildren = [];
      toArray(children).forEach(function (childrenItem, idx) {
        cloneChildren.push(renderCol(childrenItem, 'label', idx));
        if (layout === 'vertical') {
          cloneContentChildren.push(renderCol(childrenItem, 'content', idx));
        } else if (bordered) {
          cloneChildren.push(renderCol(childrenItem, 'content', idx));
        }
      });

      if (layout === 'vertical') {
        return [h(
          'tr',
          { 'class': prefixCls + '-row', key: 'label-' + index },
          [cloneChildren]
        ), h(
          'tr',
          { 'class': prefixCls + '-row', key: 'content-' + index },
          [cloneContentChildren]
        )];
      }

      return h(
        'tr',
        { 'class': prefixCls + '-row', key: index },
        [cloneChildren]
      );
    }
  },
  mounted: function mounted() {
    var _this = this;

    var column = this.$props.column;

    this.token = _responsiveObserve2['default'].subscribe(function (screens) {
      if ((typeof column === 'undefined' ? 'undefined' : (0, _typeof3['default'])(column)) !== 'object') {
        return;
      }
      _this.setState({
        screens: screens
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    _responsiveObserve2['default'].unsubscribe(this.token);
  },
  render: function render() {
    var _ref2,
        _this2 = this;

    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        size = _$props.size,
        _$props$bordered = _$props.bordered,
        bordered = _$props$bordered === undefined ? false : _$props$bordered,
        _$props$layout = _$props.layout,
        layout = _$props$layout === undefined ? 'horizontal' : _$props$layout,
        _$props$colon = _$props.colon,
        colon = _$props$colon === undefined ? true : _$props$colon;

    var title = (0, _propsUtil.getComponentFromProp)(this, 'title') || null;
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('descriptions', customizePrefixCls);

    var column = this.getColumn();
    var children = this.$slots['default'];
    var cloneChildren = toArray(children).map(function (child) {
      if ((0, _propsUtil.isValidElement)(child)) {
        return (0, _vnode.cloneElement)(child, {
          props: {
            prefixCls: prefixCls
          }
        });
      }
      return null;
    }).filter(function (node) {
      return node;
    });

    var childrenArray = generateChildrenRows(cloneChildren, column);
    return h(
      'div',
      {
        'class': [prefixCls, (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, prefixCls + '-' + size, size !== 'default'), (0, _defineProperty3['default'])(_ref2, prefixCls + '-bordered', !!bordered), _ref2)]
      },
      [title && h(
        'div',
        { 'class': prefixCls + '-title' },
        [title]
      ), h(
        'div',
        { 'class': prefixCls + '-view' },
        [h('table', [h('tbody', [childrenArray.map(function (child, index) {
          return _this2.renderRow(child, index, {
            prefixCls: prefixCls
          }, bordered, layout, colon);
        })])])]
      )]
    );
  }
};

Descriptions.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Descriptions.name, Descriptions);
  Vue.component(Descriptions.Item.name, Descriptions.Item);
};

exports['default'] = Descriptions;