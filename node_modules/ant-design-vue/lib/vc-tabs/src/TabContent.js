'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../../_util/vnode');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TabContent',
  props: {
    animated: { type: Boolean, 'default': true },
    animatedWithMargin: { type: Boolean, 'default': true },
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    tabBarPosition: String,
    direction: _vueTypes2['default'].string,
    destroyInactiveTabPane: _vueTypes2['default'].bool
  },
  computed: {
    classes: function classes() {
      var _ref;

      var animated = this.animated,
          prefixCls = this.prefixCls;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls + '-content', true), (0, _defineProperty3['default'])(_ref, animated ? prefixCls + '-content-animated' : prefixCls + '-content-no-animated', true), _ref;
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
        newChildren.push((0, _vnode.cloneElement)(child, {
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
      var activeIndex = (0, _utils.getActiveIndex)(this.$slots['default'], activeKey);
      if (activeIndex !== -1) {
        var animatedStyle = animatedWithMargin ? (0, _utils.getMarginStyle)(activeIndex, tabBarPosition) : (0, _utils.getTransformPropValue)((0, _utils.getTransformByIndex)(activeIndex, tabBarPosition, direction));
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