import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../_util/vue-types';
import { cloneElement } from '../../_util/vnode';
import { getTransformByIndex, getActiveIndex, getTransformPropValue, getMarginStyle } from './utils';
export default {
  name: 'TabContent',
  props: {
    animated: { type: Boolean, 'default': true },
    animatedWithMargin: { type: Boolean, 'default': true },
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabBarPosition: String,
    direction: PropTypes.string,
    destroyInactiveTabPane: PropTypes.bool
  },
  computed: {
    classes: function classes() {
      var _ref;

      var animated = this.animated,
          prefixCls = this.prefixCls;

      return _ref = {}, _defineProperty(_ref, prefixCls + '-content', true), _defineProperty(_ref, animated ? prefixCls + '-content-animated' : prefixCls + '-content-no-animated', true), _ref;
    }
  },
  methods: {
    getTabPanes: function getTabPanes() {
      var props = this.$props;
      var activeKey = props.activeKey;
      var children = this.$slots['default'] || [];
      var newChildren = [];

      children.forEach(function (child) {
        if (!child) {
          return;
        }
        var key = child.key;
        var active = activeKey === key;
        newChildren.push(cloneElement(child, {
          props: {
            active: active,
            destroyInactiveTabPane: props.destroyInactiveTabPane,
            rootPrefixCls: props.prefixCls
          }
        }));
      });

      return newChildren;
    }
  },
  render: function render() {
    var h = arguments[0];
    var activeKey = this.activeKey,
        tabBarPosition = this.tabBarPosition,
        animated = this.animated,
        animatedWithMargin = this.animatedWithMargin,
        direction = this.direction,
        classes = this.classes;

    var style = {};
    if (animated && this.$slots['default']) {
      var activeIndex = getActiveIndex(this.$slots['default'], activeKey);
      if (activeIndex !== -1) {
        var animatedStyle = animatedWithMargin ? getMarginStyle(activeIndex, tabBarPosition) : getTransformPropValue(getTransformByIndex(activeIndex, tabBarPosition, direction));
        style = animatedStyle;
      } else {
        style = {
          display: 'none'
        };
      }
    }
    return h(
      'div',
      { 'class': classes, style: style },
      [this.getTabPanes()]
    );
  }
};