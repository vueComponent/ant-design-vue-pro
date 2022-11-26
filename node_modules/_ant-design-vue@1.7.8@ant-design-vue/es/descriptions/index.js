import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import warning from '../_util/warning';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Col from './Col';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, isValidElement, getOptionProps, getComponentFromProp } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import Base from '../base';
import { cloneElement } from '../_util/vnode';

export var DescriptionsItemProps = {
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  span: PropTypes.number
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

export var DescriptionsItem = {
  name: 'ADescriptionsItem',
  props: initDefaultProps(DescriptionsItemProps, { span: 1 })
};

export var DescriptionsProps = {
  prefixCls: PropTypes.string,
  bordered: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'middle', 'small']).def('default'),
  title: PropTypes.any,
  column: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  colon: PropTypes.bool
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
    var itemProps = getOptionProps(node);
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
      itemNode = cloneElement(itemNode, {
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

      warning(leftSpans === 0 && lastSpanSame, 'Descriptions', 'Sum of column `span` in a line exceeds `column` of Descriptions.');
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
  mixins: [BaseMixin],
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  props: initDefaultProps(DescriptionsProps, {
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

      if ((typeof column === 'undefined' ? 'undefined' : _typeof(column)) === 'object') {
        for (var i = 0; i < responsiveArray.length; i++) {
          var breakpoint = responsiveArray[i];
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
        return h(Col, {
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

    this.token = ResponsiveObserve.subscribe(function (screens) {
      if ((typeof column === 'undefined' ? 'undefined' : _typeof(column)) !== 'object') {
        return;
      }
      _this.setState({
        screens: screens
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    ResponsiveObserve.unsubscribe(this.token);
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

    var title = getComponentFromProp(this, 'title') || null;
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('descriptions', customizePrefixCls);

    var column = this.getColumn();
    var children = this.$slots['default'];
    var cloneChildren = toArray(children).map(function (child) {
      if (isValidElement(child)) {
        return cloneElement(child, {
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
        'class': [prefixCls, (_ref2 = {}, _defineProperty(_ref2, prefixCls + '-' + size, size !== 'default'), _defineProperty(_ref2, prefixCls + '-bordered', !!bordered), _ref2)]
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
  Vue.use(Base);
  Vue.component(Descriptions.name, Descriptions);
  Vue.component(Descriptions.Item.name, Descriptions.Item);
};

export default Descriptions;